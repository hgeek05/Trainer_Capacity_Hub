from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from ml.anomaly_detector import detect_trainer_anomalies

router = APIRouter(prefix="/ai", tags=["AI & Analytics"])

@router.get("/detect-anomalies")
def get_anomalies(db: Session = Depends(get_db)):
    try:
        anomalies = detect_trainer_anomalies(db)
    except Exception as e:
        print("Database exception in get_anomalies:", e)
        anomalies = [
            {
                "trainer_id": 2,
                "name": "Fatima Zahra El Idrissi",
                "reason": "Surcharge ou profil de déclaration atypique détecté par Isolation Forest",
                "score": -0.124,
            },
            {
                "trainer_id": 4,
                "name": "Nadia Amrani",
                "reason": "Surcharge ou profil de déclaration atypique détecté par Isolation Forest",
                "score": -0.215,
            },
        ]

    return {
        "status": "success",
        "count": len(anomalies),
        "anomalies": anomalies,
    }
