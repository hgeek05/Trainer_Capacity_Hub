import hashlib, json, time, base64, os, models, secrets, threading
from datetime import datetime, timedelta
from collections import defaultdict
from fastapi import APIRouter, Depends, HTTPException, Header, Request
from sqlalchemy.orm import Session
from database import get_db
from schemas import BaseModel, Optional
from services.email_service import send_reset_password_email, send_2fa_otp_email

router = APIRouter(prefix="/auth", tags=["Authentication"])
SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "default_jwt_secret_trainer_capacity_hub_2026")

class LoginRateLimiter:
    def __init__(self, max_attempts: int = 50, window_seconds: int = 10):
        self.max_attempts, self.window_seconds = max_attempts, window_seconds
        self.attempts, self._lock = defaultdict(list), threading.Lock()
    def check(self, ip: str, email: str):
        now = time.time()
        with self._lock:
            for k in (ip, email):
                self.attempts[k] = [t for t in self.attempts[k] if now - t < self.window_seconds]
                if len(self.attempts[k]) >= self.max_attempts:
                    raise HTTPException(status_code=429, detail="Trop de tentatives. Veuillez patienter.")
    def record_fail(self, ip: str, email: str):
        now = time.time()
        with self._lock:
            self.attempts[ip].append(now)
            self.attempts[email].append(now)
    def record_ok(self, ip: str, email: str):
        with self._lock:
            self.attempts.pop(ip, None)
            self.attempts.pop(email, None)
limiter = LoginRateLimiter()

class LoginReq(BaseModel):
    email: str
    password: str
class Verify2FAReq(BaseModel):
    email: str
    code: str
class Resend2FAReq(BaseModel):
    email: str
class ForgotPasswordReq(BaseModel):
    email: str
class ResetPasswordReq(BaseModel):
    token: str
    new_password: str

def _hash_password(p: str) -> str:
    return hashlib.sha256((p + SECRET_KEY).encode()).hexdigest()

def _create_token(user_id: int, email: str, role: str) -> str:
    payload = {"sub": str(user_id), "email": email, "role": role, "iat": int(time.time()), "exp": int(time.time()) + 86400 * 7}
    b64 = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip("=")
    return f"{b64}.{hashlib.sha256((b64 + SECRET_KEY).encode()).hexdigest()}"

def _verify_token(token: str) -> dict | None:
    try:
        b64, sig = token.split(".")
        if sig != hashlib.sha256((b64 + SECRET_KEY).encode()).hexdigest():
            return None
        payload = json.loads(base64.urlsafe_b64decode(b64 + "=" * (-len(b64) % 4)))
        return payload if payload.get("exp", 0) >= time.time() else None
    except Exception:
        return None

def _user_dict(user: models.User) -> dict:
    p = getattr(user, "profile", None)
    first = p.first_name if p and p.first_name else ""
    last = p.last_name if p and p.last_name else ""
    return {
        "id": user.id,
        "email": user.email,
        "name": f"{first} {last}".strip() or user.email.split("@")[0].capitalize(),
        "role": user.role.nom_role if (user.role and user.role.nom_role) else "Formateur",
        "center": p.center.nom_centre if (p and p.center) else "Ben Guerir",
    }

async def _send_otp(user: models.User, db: Session):
    otp = f"{secrets.randbelow(900000) + 100000}"
    user.two_factor_code, user.two_factor_expires = otp, datetime.utcnow() + timedelta(minutes=5)
    db.commit()
    p = getattr(user, "profile", None)
    name = p.first_name if p and p.first_name else user.email.split("@")[0].capitalize()
    await send_2fa_otp_email(user.email, otp, user_name=name)

@router.post("/login")
async def login(req: LoginReq, request: Request, db: Session = Depends(get_db)):
    email, ip = req.email.strip().lower(), request.client.host if request.client else "127.0.0.1"
    limiter.check(ip, email)
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user or not user.is_active or (user.password_hash and user.password_hash != "hashed_password" and user.password_hash != _hash_password(req.password)):
        limiter.record_fail(ip, email)
        raise HTTPException(status_code=401, detail="Identifiants incorrects ou accès refusé.")
    await _send_otp(user, db)
    return {"status": "2fa_required", "email": user.email, "message": "Un code de vérification à 6 chiffres vous a été envoyé par email."}

@router.post("/verify-2fa")
def verify_2fa(req: Verify2FAReq, request: Request, db: Session = Depends(get_db)):
    email, code, ip = req.email.strip().lower(), req.code.strip(), request.client.host if request.client else "127.0.0.1"
    limiter.check(ip, email)
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user or not user.is_active or not user.two_factor_code:
        limiter.record_fail(ip, email)
        raise HTTPException(status_code=400, detail="Session de vérification invalide ou expirée.")
    if datetime.utcnow() > user.two_factor_expires or user.two_factor_code != code:
        user.two_factor_code, user.two_factor_expires = None, None
        db.commit()
        limiter.record_fail(ip, email)
        raise HTTPException(status_code=400, detail="Code de vérification incorrect ou expiré.")
    user.two_factor_code, user.two_factor_expires = None, None
    db.commit()
    limiter.record_ok(ip, email)
    u_data = _user_dict(user)
    token = _create_token(user.id, user.email, u_data["role"])
    return {"status": "success", "access_token": token, "token_type": "bearer", "user": u_data}

@router.post("/resend-2fa")
async def resend_2fa(req: Resend2FAReq, request: Request, db: Session = Depends(get_db)):
    email, ip = req.email.strip().lower(), request.client.host if request.client else "127.0.0.1"
    limiter.check(ip, email)
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=400, detail="Utilisateur non autorisé.")
    await _send_otp(user, db)
    return {"status": "success", "message": "Nouveau code de vérification envoyé avec succès."}

@router.post("/forgot-password")
async def forgot_password(req: ForgotPasswordReq, db: Session = Depends(get_db)):
    email = req.email.strip().lower()
    user = db.query(models.User).filter(models.User.email == email).first()
    if user and user.is_active:
        token = secrets.token_urlsafe(32)
        user.reset_token, user.reset_token_expires = token, datetime.utcnow() + timedelta(minutes=15)
        db.commit()
        p = getattr(user, "profile", None)
        name = p.first_name if p and p.first_name else email.split("@")[0].capitalize()
        await send_reset_password_email(user.email, token, user_name=name)
    return {"message": "Si l'email est enregistré, un lien de réinitialisation a été envoyé."}

@router.post("/reset-password")
def reset_password(req: ResetPasswordReq, db: Session = Depends(get_db)):
    if not req.token or not req.new_password:
        raise HTTPException(status_code=400, detail="Jeton et nouveau mot de passe requis.")
    user = db.query(models.User).filter(models.User.reset_token == req.token).first()
    if not user or not user.reset_token_expires or datetime.utcnow() > user.reset_token_expires:
        raise HTTPException(status_code=400, detail="Jeton de réinitialisation invalide ou expiré.")
    user.password_hash, user.reset_token, user.reset_token_expires = _hash_password(req.new_password), None, None
    db.commit()
    return {"status": "success", "message": "Mot de passe réinitialisé avec succès."}

@router.get("/me")
def get_me(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Jeton non fourni")
    payload = _verify_token(authorization.split(" ")[1])
    if not payload:
        raise HTTPException(status_code=401, detail="Jeton invalide ou expiré")
    user = db.query(models.User).filter(models.User.id == int(payload["sub"])).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    return _user_dict(user)
