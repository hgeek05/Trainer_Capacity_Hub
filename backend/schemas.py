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
    # Field(...) signifie que la donnée est obligatoire.
    matricule: str = Field(..., description="Donnée sensible : Identifiant unique")
    nom_prenom: str = Field(..., description="Nom et prénom complets")
    email: str = Field(..., description="Adresse e-mail Technix UM6P")
    role: RoleEnum = Field(...)
    centre: CenterEnum = Field(...)
    date_entree: date = Field(...)
    manager_responsable: Optional[str] = Field(None, description="Donnée facultative")

# 3. DONNÉES DE CHARGE ET DISPONIBILITÉ
class ActivityData(BaseModel):
    formateur_id: str = Field(..., description="Lien avec l'utilisateur")
    type_activite: ActivityTypeEnum = Field(...)
    # Ajout du paramètre gt=0 (greater than 0) pour rejeter les durées négatives
    duree_heures: float = Field(..., gt=0, description="La durée doit être strictement positive")
    date_debut: date = Field(...)

# Schéma pour la création (ce qu'on envoie à l'API)
class UserCreate(BaseModel):
    employee_id: str
    email: EmailStr
    first_name: str
    last_name: str
    is_active: bool = True

# Schéma pour la réponse (ce que l'API renvoie)
class UserResponse(UserCreate):
    id: int

    first_name: Optional[str] = None
    last_name: Optional[str] = None

    class Config:
        from_attributes = True

# Schéma simple pour la création via /trainers (front-end léger)
class TrainerCreate(BaseModel):
    name: str
    email: EmailStr
    role: Optional[str] = "Formateur"
    center: Optional[str] = "Ben Guerir"
    center_id: Optional[int] = 1
    domain: Optional[str] = "Digital"


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