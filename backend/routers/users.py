from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas


router = APIRouter(prefix="/users", tags=["Users"])


def _serialize_user(user: models.User) -> dict:
    profile = user.profile
    return {
        "id": user.id,
        "employee_id": user.employee_id,
        "email": user.email,
        "first_name": profile.first_name if profile else None,
        "last_name": profile.last_name if profile else None,
        "is_active": user.is_active,
    }

@router.post("/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Vérifier si l'utilisateur existe déjà
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    formateur_role = db.query(models.Role).filter(models.Role.nom_role == "Formateur").first()
    if formateur_role is None:
        formateur_role = models.Role(nom_role="Formateur")
        db.add(formateur_role)
        db.flush()

    # Création dans la base
    new_user = models.User(
        employee_id=user.employee_id,
        email=user.email,
        password_hash="hashed_password",
        role_id=formateur_role.id,
        is_active=user.is_active
    )
    db.add(new_user)
    db.flush()

    new_profile = models.Profile(
        user_id=new_user.id,
        first_name=user.first_name,
        last_name=user.last_name,
        job_title="Formateur Interne",
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_user)
    
    return _serialize_user(new_user)

@router.get("/", response_model=list[schemas.UserResponse])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return [_serialize_user(user) for user in users]