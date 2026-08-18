from pydantic import BaseModel, EmailStr, Field
from datetime import date
from enum import Enum
from typing import Optional

# 1. NOMENCLATURE : On définit les listes exactes pour éviter les erreurs de saisie
class RoleEnum(str, Enum):
    FORMATEUR = "Formateur"
    MANAGER = "Manager"

class CenterEnum(str, Enum):
    BEN_GUERIR = "Ben Guerir"
    SAFI = "Safi"
    JORF_LASFAR = "Jorf Lasfar"
    KHOURIBGA = "Khouribga"

class ActivityTypeEnum(str, Enum):
    ANIMATION = "Animation"
    PREPARATION = "Préparation"
    CONGE = "Congé"

# 2. DONNÉES UTILISATEURS (Identification requise par le tuteur)
class UserData(BaseModel):
    matricule: str = Field(..., min_length=2, max_length=50, description="Donnée sensible : Identifiant unique")
    nom_prenom: str = Field(..., min_length=2, max_length=100, description="Nom et prénom complets")
    email: EmailStr = Field(..., description="Adresse e-mail Technix UM6P")
    role: RoleEnum = Field(...)
    centre: CenterEnum = Field(...)
    date_entree: date = Field(...)
    manager_responsable: Optional[str] = Field(None, max_length=100, description="Donnée facultative")

# 3. DONNÉES DE CHARGE ET DISPONIBILITÉ
class ActivityData(BaseModel):
    formateur_id: str = Field(..., min_length=1, max_length=50, description="Lien avec l'utilisateur")
    type_activite: ActivityTypeEnum = Field(...)
    duree_heures: float = Field(..., gt=0, le=24, description="La durée doit être supérieure à 0 et inférieure ou égale à 24 heures")
    date_debut: date = Field(...)

# Schéma pour la création d'utilisateur
class UserCreate(BaseModel):
    employee_id: str = Field(..., min_length=2, max_length=30, pattern=r"^[A-Za-z0-9_-]+$")
    email: EmailStr
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    is_active: bool = True

# Schéma pour la réponse utilisateur
class UserResponse(UserCreate):
    id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None

    class Config:
        from_attributes = True

# Schéma pour la création via /trainers (front-end léger avec validation stricte)
class TrainerCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Nom complet du formateur")
    email: EmailStr
    role: Optional[str] = Field("Formateur", max_length=50)
    center: Optional[str] = Field("Ben Guerir", max_length=50)
    center_id: Optional[int] = Field(1, ge=1)
    domain: Optional[str] = Field("Digital", max_length=50)

class CapacitySummaryResponse(BaseModel):
    capacite_globale_nette: int
    jours_favorables_animation: int
    cible_animation: int
    fenetres_bloquees: int
    hors_animation_cible: int

class TrainerDashboardItem(BaseModel):
    formateur_id: str
    global_days: str
    animation_days: str
    statut_fenetre: str
    taux: int
    alerte: str

class PlanningSessionCreate(BaseModel):
    id: Optional[str] = None
    title: str = Field(..., min_length=2, max_length=200)
    trainerName: str = Field(..., min_length=2, max_length=100)
    trainerDomain: str = Field(..., max_length=100)
    center: str = Field(..., max_length=100)
    startDate: str = Field(..., max_length=20)
    endDate: str = Field(..., max_length=20)
    durationDays: int = Field(..., ge=1, le=365)
    status: str = Field("CONFIRMED", max_length=50)
    room: Optional[str] = None
    coTrainerName: Optional[str] = None

class PlanningSessionUpdate(BaseModel):
    title: Optional[str] = None
    trainerName: Optional[str] = None
    trainerDomain: Optional[str] = None
    center: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    durationDays: Optional[int] = None
    status: Optional[str] = None
    room: Optional[str] = None
    coTrainerName: Optional[str] = None

class PlanningSessionResponse(BaseModel):
    id: str
    title: str
    trainerName: str
    trainerDomain: str
    center: str
    startDate: str
    endDate: str
    durationDays: int
    status: str
    room: Optional[str] = None
    coTrainerName: Optional[str] = None

    class Config:
        from_attributes = True

class ProfileUpdateSchema(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    job_title: Optional[str] = None
    specialty_id: Optional[int] = None
    home_center_id: Optional[int] = None
    phone: Optional[str] = None
    bio: Optional[str] = None

class ProfileResponseSchema(BaseModel):
    user_id: int
    employee_id: Optional[str] = None
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    job_title: Optional[str] = None
    home_center_id: Optional[int] = None
    specialty_id: Optional[int] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    hire_date: Optional[date] = None
    manager_id: Optional[int] = None
    role_name: Optional[str] = None
    center_name: Optional[str] = None
    specialty_name: Optional[str] = None

    class Config:
        from_attributes = True

