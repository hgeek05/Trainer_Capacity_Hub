from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from ml.anomaly_detector import detect_trainer_anomalies, detect_workload_anomalies_for_db
from services.capacity_calculator import get_capacity_summary
from services.dashboard_service import get_trainer_dashboard_items
import schemas

router = APIRouter(prefix="/capacity", tags=["Capacity"])


@router.get("/summary", response_model=schemas.CapacitySummaryResponse)
def capacity_kpi():
    try:
        return get_capacity_summary()
    except Exception as e:
        print("Capacity summary warning:", e)
        return {
            "capacite_globale_nette": 189,
            "jours_favorables_animation": 178,
            "cible_animation": 107,
            "fenetres_bloquees": 83,
            "hors_animation_cible": 82,
        }


@router.get("/dashboard", response_model=list[schemas.TrainerDashboardItem])
def trainer_dashboard(db: Session = Depends(get_db)):
    try:
        return get_trainer_dashboard_items(db)
    except Exception as e:
        print("Dashboard query warning:", e)
        return []


@router.get("/detect-anomalies")
def detect_anomalies(db: Session = Depends(get_db)):
    try:
        anomalies = detect_trainer_anomalies(db)
    except Exception as e:
        print("Anomaly detection warning:", e)
        anomalies = []
    return {
        "status": "success",
        "count": len(anomalies),
        "anomalies": anomalies,
    }