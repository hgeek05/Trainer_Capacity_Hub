import hashlib
import json
import time
import base64
import os
from collections import defaultdict
import threading
from fastapi import APIRouter, Depends, HTTPException, Header, Request
from sqlalchemy.orm import Session
from database import get_db
import models
from schemas import BaseModel, EmailStr, Field, Optional

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Secret Key pour JWT (obtenue depuis l'environnement, erreur explicite si absente)
SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY environment variable is not set")

class LoginRateLimiter:
    """
    In-memory Rate Limiter anti-Brute Force pour /auth/login.
    Limite à max_attempts tentatives échouées par IP & Email sur une fenêtre glissante.
    """
    def __init__(self, max_attempts: int = 5, window_seconds: int = 60):
        self.max_attempts = max_attempts
        self.window_seconds = window_seconds
        self.ip_attempts = defaultdict(list)
        self.email_attempts = defaultdict(list)
        self._lock = threading.Lock()

    def _clean(self, key: str, attempts_dict: dict, now: float):
        attempts_dict[key] = [t for t in attempts_dict[key] if now - t < self.window_seconds]
        if not attempts_dict[key]:
            attempts_dict.pop(key, None)

    def check_rate_limit(self, ip: str, email: str):
        now = time.time()
        with self._lock:
            self._clean(ip, self.ip_attempts, now)
            self._clean(email, self.email_attempts, now)

            if len(self.ip_attempts.get(ip, [])) >= self.max_attempts or len(self.email_attempts.get(email, [])) >= self.max_attempts:
                retry_after = int(self.window_seconds)
                raise HTTPException(
                    status_code=429,
                    detail=f"Trop de tentatives de connexion échouées. Par sécurité, votre accès est bloqué temporairement pendant {retry_after} secondes.",
                    headers={"Retry-After": str(retry_after)}
                )

    def record_failure(self, ip: str, email: str):
        now = time.time()
        with self._lock:
            self.ip_attempts[ip].append(now)
            self.email_attempts[email].append(now)

    def record_success(self, ip: str, email: str):
        with self._lock:
            self.ip_attempts.pop(ip, None)
            self.email_attempts.pop(email, None)

login_limiter = LoginRateLimiter(max_attempts=5, window_seconds=60)

class LoginRequest(BaseModel):
    email: str = Field(..., description="Email du formateur ou manager")
    password: str = Field(..., description="Mot de passe")

def _hash_password(password: str) -> str:
    return hashlib.sha256((password + SECRET_KEY).encode()).hexdigest()

def _create_token(user_id: int, email: str, role: str) -> str:
    payload = {
        "sub": str(user_id),
        "email": email,
        "role": role,
        "iat": int(time.time()),
        "exp": int(time.time()) + 86400 * 7 # 7 jours
    }
    payload_bytes = json.dumps(payload).encode()
    b64_payload = base64.urlsafe_b64encode(payload_bytes).decode().rstrip("=")
    signature = hashlib.sha256((b64_payload + SECRET_KEY).encode()).hexdigest()
    return f"{b64_payload}.{signature}"

def _verify_token(token: str) -> dict | None:
    try:
        parts = token.split(".")
        if len(parts) != 2:
            return None
        b64_payload, signature = parts
        expected_sig = hashlib.sha256((b64_payload + SECRET_KEY).encode()).hexdigest()
        if signature != expected_sig:
            return None
        padded = b64_payload + "=" * (-len(b64_payload) % 4)
        payload_bytes = base64.urlsafe_b64decode(padded)
        payload = json.loads(payload_bytes.decode())
        if payload.get("exp", 0) < time.time():
            return None
        return payload
    except Exception:
        return None

@router.post("/login")
def login(req: LoginRequest, request: Request, db: Session = Depends(get_db)):
    email_clean = req.email.strip().lower()
    client_ip = request.client.host if request.client and request.client.host else "127.0.0.1"

    # Vérification Anti-Brute Force (max 5 tentatives par minute par IP/Email)
    login_limiter.check_rate_limit(client_ip, email_clean)
    user = db.query(models.User).filter(models.User.email == email_clean).first()
    # Si l'utilisateur existe en BDD
    if user:
        input_hash = _hash_password(req.password)
        if not user.password_hash or user.password_hash == "hashed_password" or user.password_hash != input_hash:
            login_limiter.record_failure(client_ip, email_clean)
            raise HTTPException(status_code=401, detail="Identifiants incorrects. Vérifiez votre email et mot de passe.")

        login_limiter.record_success(client_ip, email_clean)
        profile = getattr(user, "profile", None)
        first_name = profile.first_name if profile and profile.first_name else ""
        last_name = profile.last_name if profile and profile.last_name else ""
        full_name = f"{first_name} {last_name}".strip() or email_clean.split("@")[0].capitalize()
        role_name = user.role.nom_role if (user.role and user.role.nom_role in ["Manager", "Administrateur", "Planificateur"]) else ("Manager" if ("manager" in email_clean or "admin" in email_clean or "salmi" in email_clean) else "Manager")
        center_name = profile.center.nom_centre if profile and profile.center else "Ben Guerir"
        token = _create_token(user.id, user.email, role_name)
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "name": full_name,
                "role": role_name,
                "center": center_name,
            }
        }

    # Fix 2 & 3: Restriction stricte aux domaines institutionnels @um6p.ma / @ocp.ma et attribution du rôle Formateur par défaut
    if email_clean.endswith("@um6p.ma") or email_clean.endswith("@ocp.ma"):
        target_role_name = "Formateur"
        role_obj = db.query(models.Role).filter(models.Role.nom_role == target_role_name).first()
        if not role_obj:
            role_obj = models.Role(nom_role=target_role_name)
            db.add(role_obj)
            db.flush()
        center_obj = db.query(models.Center).filter(models.Center.nom_centre == "Ben Guerir").first()
        if not center_obj:
            center_obj = models.Center(nom_centre="Ben Guerir")
            db.add(center_obj)
            db.flush()
        new_user = models.User(
            employee_id=f"EMP{int(time.time()) % 10000}",
            email=email_clean,
            password_hash=_hash_password(req.password),
            role_id=role_obj.id,
            is_active=True,
        )
        db.add(new_user)
        db.flush()
        name_part = email_clean.split("@")[0].replace(".", " ").title()
        parts = name_part.split(" ", 1)
        first_name = parts[0]
        last_name = parts[1] if len(parts) > 1 else ""
        db.add(models.Profile(user_id=new_user.id, first_name=first_name, last_name=last_name, home_center_id=center_obj.id))
        db.commit()
        db.refresh(new_user)
        login_limiter.record_success(client_ip, email_clean)
        token = _create_token(new_user.id, new_user.email, target_role_name)
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": new_user.id,
                "email": new_user.email,
                "name": name_part,
                "role": target_role_name,
                "center": "Ben Guerir",
            }
        }
    login_limiter.record_failure(client_ip, email_clean)
    raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect.")

@router.get("/me")
def get_me(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Jeton non fourni")
    token = authorization.split(" ")[1]
    payload = _verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Jeton invalide ou expiré")
    user_id = int(payload["sub"])
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    profile = getattr(user, "profile", None)
    full_name = f"{profile.first_name} {profile.last_name}".strip() if profile else user.email
    return {
        "id": user.id,
        "email": user.email,
        "name": full_name,
        "role": user.role.nom_role if user.role else "Formateur",
        "center": profile.center.nom_centre if profile and profile.center else "Ben Guerir",
    }
