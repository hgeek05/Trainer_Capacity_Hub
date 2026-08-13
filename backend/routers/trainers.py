import random
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from routers.trainer_utils import (
    DEFAULT_DEMO_TRAINERS,
    _calculate_trainer_metrics,
    build_trainer_dict,
)

router = APIRouter(prefix="/trainers", tags=["Trainers"])

@router.get("/")
def get_trainers(db: Session = Depends(get_db)):
    db_trainers = []
    try:
        users = db.query(models.User).all()
        for idx, u in enumerate(users):
            db_trainers.append(build_trainer_dict(u, idx))
    except Exception as e:
        print("Database error in get_trainers:", e)
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

    new_user = models.User(
        employee_id=f"EMP{random.randint(1000,9999)}",
        email=trainer.email,
        password_hash="hashed_password",
        role_id=role.id,
        is_active=True,
    )
    db.add(new_user)
    db.flush()

    first, last = trainer.name.split(" ", 1) if " " in trainer.name else (trainer.name, "")
    db.add(models.Profile(user_id=new_user.id, first_name=first, last_name=last, home_center_id=center_id))
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