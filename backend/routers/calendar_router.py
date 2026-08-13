from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import holidays

router = APIRouter(prefix="/calendar", tags=["Calendar & Holidays"])

@router.get("/auto-holidays")
def get_auto_morocco_holidays(year: int = 2026):
    """
    Génère automatiquement les jours fériés officiels du Maroc (légaux et religieux)
    pour l'année spécifiée via la bibliothèque Python `holidays`.
    """
    try:
        morocco_hols = holidays.Morocco(years=year)
        holiday_list = []
        for dt, name in sorted(morocco_hols.items()):
            holiday_list.append({
                "date": str(dt),
                "name": name,
                "type": "Jour Férié Officiel (Maroc)",
                "status": "Neutralisé"
            })
        return {
            "status": "success",
            "year": year,
            "count": len(holiday_list),
            "holidays": holiday_list,
        }
    except Exception as e:
        print("Erreur lors de la génération des jours fériés:", e)
        # Fallback pour le Maroc 2026 si exception
        fallback_2026 = [
            {"date": "2026-01-01", "name": "Nouvel An", "type": "Jour Férié Officiel (Maroc)", "status": "Neutralisé"},
            {"date": "2026-01-11", "name": "Manifeste de l'Indépendance", "type": "Jour Férié Officiel (Maroc)", "status": "Neutralisé"},
            {"date": "2026-01-14", "name": "Nouvel An Amazigh", "type": "Jour Férié Officiel (Maroc)", "status": "Neutralisé"},
            {"date": "2026-03-20", "name": "Aïd al-Fitr (Estimation)", "type": "Fête Religieuse (Maroc)", "status": "Neutralisé"},
            {"date": "2026-05-01", "name": "Fête du Travail", "type": "Jour Férié Officiel (Maroc)", "status": "Neutralisé"},
            {"date": "2026-05-27", "name": "Aïd al-Adha (Estimation)", "type": "Fête Religieuse (Maroc)", "status": "Neutralisé"},
            {"date": "2026-07-30", "name": "Fête du Trône", "type": "Jour Férié Officiel (Maroc)", "status": "Neutralisé"},
            {"date": "2026-08-14", "name": "Allégeance Oued Eddahab", "type": "Jour Férié Officiel (Maroc)", "status": "Neutralisé"},
            {"date": "2026-08-20", "name": "Révolution du Roi et du Peuple", "type": "Jour Férié Officiel (Maroc)", "status": "Neutralisé"},
            {"date": "2026-08-21", "name": "Fête de la Jeunesse", "type": "Jour Férié Officiel (Maroc)", "status": "Neutralisé"},
            {"date": "2026-11-06", "name": "Marche Verte", "type": "Jour Férié Officiel (Maroc)", "status": "Neutralisé"},
            {"date": "2026-11-18", "name": "Fête de l'Indépendance", "type": "Jour Férié Officiel (Maroc)", "status": "Neutralisé"},
        ]
        return {
            "status": "fallback",
            "year": year,
            "count": len(fallback_2026),
            "holidays": fallback_2026,
        }
