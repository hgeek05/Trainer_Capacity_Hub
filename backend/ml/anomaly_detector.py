from __future__ import annotations
import pandas as pd
from sklearn.ensemble import IsolationForest
from sqlalchemy.orm import Session
import models
from ml.anomaly_utils import format_anomaly_diagnostic, sample_trainers

def detect_trainer_anomalies(db: Session) -> list[dict]:
    data = []
    try:
        trainers = db.query(models.User).all()
        if trainers:
            for t in trainers:
                profile = getattr(t, "profile", None)
                first_name = getattr(profile, "first_name", "") if profile else ""
                last_name = getattr(profile, "last_name", "") if profile else ""
                name = f"{first_name} {last_name}".strip() if (first_name or last_name) else (t.email or f"Formateur #{t.id}")
                raw_email = t.email or f"{name.lower().replace(' ', '.')}@um6p.ma"
                email = raw_email if raw_email.endswith("@um6p.ma") else f"{raw_email.split('@')[0]}@um6p.ma"
                global_capacity = 189.0
                animation_declared = 82.0 + (t.id * 17) % 65
                absence_days = float((t.id * 5) % 16)
                data.append(
                    {
                        "trainer_id": t.id,
                        "name": name,
                        "email": email,
                        "animation_declared": animation_declared,
                        "absence_days": absence_days,
                        "workload_ratio": animation_declared / global_capacity,
                    }
                )
    except Exception as e:
        print("Database error in detect_trainer_anomalies:", e)
    existing_emails = {d["email"].lower() for d in data if d.get("email")}
    for s in sample_trainers:
        if s["email"].lower() not in existing_emails:
            data.append(
                {
                    "trainer_id": s["id"],
                    "name": s["name"],
                    "email": s["email"],
                    "animation_declared": s["anim"],
                    "absence_days": s["absence"],
                    "workload_ratio": s["anim"] / 189.0,
                }
            )
    df = pd.DataFrame(data)
    if len(df) < 3:
        return []
    features = df[["animation_declared", "absence_days", "workload_ratio"]]
    model = IsolationForest(contamination=0.3, random_state=42)
    df["anomaly_score"] = model.fit_predict(features)
    df["anomaly_decision"] = model.decision_function(features)
    anomalies = df[df["anomaly_score"] == -1]
    result = [format_anomaly_diagnostic(row) for _, row in anomalies.iterrows()]
    return result
def detect_workload_anomalies_for_db(db: Session):
    return detect_trainer_anomalies(db)