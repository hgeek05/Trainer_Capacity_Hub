from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(prefix="/centers", tags=["Centers"])

OFFICIAL_CENTERS = ["Ben Guerir", "Safi", "Jorf Lasfar", "Khouribga"]

DEFAULT_CENTERS = [
    {"id": 1, "nom_centre": "Ben Guerir"},
    {"id": 2, "nom_centre": "Safi"},
    {"id": 3, "nom_centre": "Jorf Lasfar"},
    {"id": 4, "nom_centre": "Khouribga"},
]


@router.get("/")
def get_centers(db: Session = Depends(get_db)):
    try:
        centers = db.query(models.Center).all()
        # Filtrer strictement pour ne garder QUE les 4 centres officiels de la BDD
        official_centers = [c for c in centers if c.nom_centre in OFFICIAL_CENTERS]
        if not official_centers:
            return DEFAULT_CENTERS
        return [{"id": c.id, "nom_centre": c.nom_centre} for c in official_centers]
    except Exception as e:
        print("Database error in get_centers:", e)
        return DEFAULT_CENTERS
