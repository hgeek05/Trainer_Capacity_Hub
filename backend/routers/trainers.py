from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
import random

router = APIRouter(prefix="/trainers", tags=["Trainers"])


def _calculate_trainer_metrics(user_id: int):
    # Produce unique, realistic workload metrics per trainer based on user_id
    base_anim = (user_id * 37 + 53) % 95 + 45  # ranges between 45j and 139j
    global_days_num = min(base_anim + ((user_id * 19) % 35 + 30), 188)
    taux = round((base_anim / 107.0) * 100)

    if base_anim > 125:
        alerte = "BLOCKED"
        statut_fenetre = "Critique"
    elif base_anim >= 108:
        alerte = "WATCH"
        statut_fenetre = "Vigilance"
    else:
        alerte = "OK"
        statut_fenetre = "Normale"

    return {
        "global_days": f"{global_days_num}/189 j",
        "animation_days": f"{base_anim}/107 j",
        "statut_fenetre": statut_fenetre,
        "taux": taux,
        "alerte": alerte,
    }


DEFAULT_DEMO_TRAINERS = [
    {
        "id": 1,
        "employee_id": "EMP001",
        "name": "Youssef Benali",
        "email": "youssef.benali@um6p.ma",
        "role": "Lead Formateur",
        "center": "Ben Guerir",
        "domain": "Digital",
        "global_days": "142/189 j",
        "animation_days": "82/107 j",
        "statut_fenetre": "Normale",
        "taux": 75,
        "alerte": "OK",
    },
    {
        "id": 2,
        "employee_id": "EMP002",
        "name": "Fatima Zahra El Idrissi",
        "email": "fatimazahra.elidrissi@um6p.ma",
        "role": "Formateur Expert",
        "center": "Safi",
        "domain": "HSE",
        "global_days": "168/189 j",
        "animation_days": "120/107 j",
        "statut_fenetre": "Vigilance",
        "taux": 89,
        "alerte": "WATCH",
    },
    {
        "id": 3,
        "employee_id": "EMP003",
        "name": "Karim Tazi",
        "email": "karim.tazi@um6p.ma",
        "role": "Formateur Senior",
        "center": "Jorf Lasfar",
        "domain": "Maintenance industrielle",
        "global_days": "121/189 j",
        "animation_days": "64/107 j",
        "statut_fenetre": "Normale",
        "taux": 64,
        "alerte": "OK",
    },
    {
        "id": 4,
        "employee_id": "EMP004",
        "name": "Nadia Amrani",
        "email": "nadia.amrani@um6p.ma",
        "role": "Formateur Senior",
        "center": "Khouribga",
        "domain": "Chimie et procédés",
        "global_days": "185/189 j",
        "animation_days": "135/107 j",
        "statut_fenetre": "Critique",
        "taux": 98,
        "alerte": "BLOCKED",
    },
    {
        "id": 5,
        "employee_id": "EMP005",
        "name": "Omar Chraibi",
        "email": "omar.chraibi@um6p.ma",
        "role": "Formateur Junior",
        "center": "Ben Guerir",
        "domain": "Industrie minière",
        "global_days": "96/189 j",
        "animation_days": "51/107 j",
        "statut_fenetre": "Normale",
        "taux": 51,
        "alerte": "OK",
    },
    {
        "id": 6,
        "employee_id": "EMP006",
        "name": "Salma Bennis",
        "email": "salma.bennis@um6p.ma",
        "role": "Formateur Expert",
        "center": "Ben Guerir",
        "domain": "Soft Skills",
        "global_days": "157/189 j",
        "animation_days": "112/107 j",
        "statut_fenetre": "Vigilance",
        "taux": 83,
        "alerte": "WATCH",
    },
]


def ensure_um6p_email(email: str | None, name: str = "") -> str:
    if not email:
        prefix = name.lower().replace(" ", ".") if name else "formateur"
        return f"{prefix}@um6p.ma"
    if not email.endswith("@um6p.ma"):
        prefix = email.split("@")[0]
        return f"{prefix}@um6p.ma"
    return email


@router.get("/")
def get_trainers(db: Session = Depends(get_db)):
    db_trainers = []
    try:
        users = db.query(models.User).all()
        OFFICIAL_CENTERS = ["Ben Guerir", "Safi", "Jorf Lasfar", "Khouribga"]
        DOMAINS = [
            "Digital",
            "HSE",
            "Maintenance industrielle",
            "Chimie et procédés",
            "Industrie minière",
            "Énergies renouvelables",
            "Agriculture",
            "Soft Skills",
        ]

        for idx, u in enumerate(users):
            profile = getattr(u, "profile", None)
            first_name = getattr(profile, "first_name", "") if profile else ""
            last_name = getattr(profile, "last_name", "") if profile else ""
            name = f"{first_name} {last_name}".strip() if (first_name or last_name) else (u.email.split("@")[0].replace(".", " ").title() if u.email else f"Formateur #{u.id}")
            center_obj = getattr(profile, "center", None) if profile else None
            center_name = getattr(center_obj, "nom_centre", None) if center_obj else None
            if not center_name or center_name not in OFFICIAL_CENTERS:
                center_name = OFFICIAL_CENTERS[idx % len(OFFICIAL_CENTERS)]
            domain_name = DOMAINS[idx % len(DOMAINS)]

            item = {
                "id": u.id,
                "employee_id": u.employee_id or f"EMP{u.id}",
                "name": name,
                "email": ensure_um6p_email(u.email, name),
                "role": getattr(u.role, 'nom_role', 'Formateur') if u.role else 'Formateur',
                "center": center_name,
                "domain": domain_name,
            }
            item.update(_calculate_trainer_metrics(u.id))
            db_trainers.append(item)
    except Exception as e:
        print("Database error in get_trainers:", e)

    # Recombine demo trainers with db_trainers (avoiding duplicates)
    existing_emails = {t["email"].lower() for t in db_trainers if t.get("email")}
    combined = list(db_trainers)
    for demo in DEFAULT_DEMO_TRAINERS:
        if demo["email"].lower() not in existing_emails:
            combined.append(demo)

    return combined


@router.post("/")
def create_trainer(trainer: schemas.TrainerCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == trainer.email).first():
        raise HTTPException(status_code=400, detail="Email déjà enregistré")

    role = db.query(models.Role).filter(models.Role.nom_role == (trainer.role or "Formateur")).first()
    if role is None:
        role = models.Role(nom_role=trainer.role or "Formateur")
        db.add(role)
        db.flush()

    center_obj = None
    if trainer.center:
        center_obj = db.query(models.Center).filter(models.Center.nom_centre == trainer.center).first()
    if not center_obj and trainer.center_id:
        center_obj = db.query(models.Center).filter(models.Center.id == trainer.center_id).first()

    center_id = center_obj.id if center_obj else 1
    center_name = center_obj.nom_centre if center_obj else (trainer.center or "Ben Guerir")

    employee_id = f"EMP{random.randint(1000,9999)}"

    new_user = models.User(
        employee_id=employee_id,
        email=trainer.email,
        password_hash="hashed_password",
        role_id=role.id,
        is_active=True,
    )
    db.add(new_user)
    db.flush()

    if " " in trainer.name:
        first, last = trainer.name.split(" ", 1)
    else:
        first, last = trainer.name, ""

    profile = models.Profile(
        user_id=new_user.id,
        first_name=first,
        last_name=last,
        home_center_id=center_id,
    )
    db.add(profile)
    db.commit()
    db.refresh(new_user)

    return {
        "id": new_user.id,
        "name": trainer.name,
        "email": new_user.email,
        "role": trainer.role or "Formateur",
        "center": center_name,
        "domain": trainer.domain or "Digital",
        **_calculate_trainer_metrics(new_user.id),
    }
