from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas

router = APIRouter(prefix="/profile", tags=["User Profile"])

@router.get("/{user_id}", response_model=schemas.ProfileResponseSchema)
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")

    profile = user.profile
    if not profile:
        # Création automatique d'un profil par défaut si inexistant
        profile = models.Profile(
            user_id=user.id,
            first_name=user.email.split("@")[0].capitalize(),
            last_name="",
            job_title="Formateur Interne",
            home_center_id=1,
            specialty_id=1
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)

    role_name = user.role.nom_role if user.role else "Formateur"
    center_name = profile.center.nom_centre if profile.center else "Ben Guerir"
    specialty_name = profile.specialty.nom_specialite if profile.specialty else "Général"

    return {
        "user_id": user.id,
        "employee_id": user.employee_id,
        "email": user.email,
        "first_name": profile.first_name,
        "last_name": profile.last_name,
        "job_title": profile.job_title,
        "home_center_id": profile.home_center_id,
        "specialty_id": profile.specialty_id,
        "phone": profile.phone,
        "bio": profile.bio,
        "hire_date": profile.hire_date,
        "manager_id": profile.manager_id,
        "role_name": role_name,
        "center_name": center_name,
        "specialty_name": specialty_name,
    }

@router.put("/{user_id}")
def update_user_profile(user_id: int, payload: schemas.ProfileUpdateSchema, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")

    profile = user.profile
    if not profile:
        profile = models.Profile(user_id=user.id)
        db.add(profile)
        db.flush()

    update_data = payload.dict(exclude_unset=True)
    for key, value in update_data.items():
        if hasattr(profile, key) and value is not None:
            setattr(profile, key, value)

    db.commit()
    db.refresh(profile)

    role_name = user.role.nom_role if user.role else "Formateur"
    center_name = profile.center.nom_centre if profile.center else "Ben Guerir"
    specialty_name = profile.specialty.nom_specialite if profile.specialty else "Général"

    return {
        "status": "success",
        "message": "Profil mis à jour avec succès",
        "profile": {
            "user_id": user.id,
            "employee_id": user.employee_id,
            "email": user.email,
            "first_name": profile.first_name,
            "last_name": profile.last_name,
            "job_title": profile.job_title,
            "home_center_id": profile.home_center_id,
            "specialty_id": profile.specialty_id,
            "phone": profile.phone,
            "bio": profile.bio,
            "hire_date": profile.hire_date,
            "manager_id": profile.manager_id,
            "role_name": role_name,
            "center_name": center_name,
            "specialty_name": specialty_name,
        }
    }
