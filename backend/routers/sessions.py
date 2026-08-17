from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas

router = APIRouter(prefix="/sessions", tags=["Sessions"])

DEFAULT_DEMO_SESSIONS = [
    {
        "id": "SES-2026-01",
        "title": "Prévention des Risques & Sécurité Industrielle",
        "trainerName": "Fatima Ait Zzi",
        "trainerDomain": "HSE",
        "center": "Ben Guerir",
        "startDate": "2026-08-10",
        "endDate": "2026-08-14",
        "durationDays": 5,
        "status": "IN_PROGRESS",
        "room": "Amphi Al Khwarizmi",
        "coTrainerName": "Youssef Benali",
    },
    {
        "id": "SES-2026-02",
        "title": "Procédés Chimiques de Valorisation des Phosphates",
        "trainerName": "Nadia Amrani",
        "trainerDomain": "Chimie et procédés",
        "center": "Safi",
        "startDate": "2026-08-12",
        "endDate": "2026-08-19",
        "durationDays": 7,
        "status": "CONFIRMED",
        "room": "Atelier Pilote Chimie",
    },
    {
        "id": "SES-2026-03",
        "title": "Maintenance Prédictive & Capteurs IoT",
        "trainerName": "Karim Tazi",
        "trainerDomain": "Maintenance industrielle",
        "center": "Jorf Lasfar",
        "startDate": "2026-08-15",
        "endDate": "2026-08-20",
        "durationDays": 5,
        "status": "SCHEDULED",
        "room": "Atelier Mécanique JL1",
        "coTrainerName": "Omar Chraibi",
    },
    {
        "id": "SES-2026-04",
        "title": "Transformation Digitale & Automates Usine",
        "trainerName": "Omar Chraibi",
        "trainerDomain": "Digital",
        "center": "Ben Guerir",
        "startDate": "2026-08-22",
        "endDate": "2026-08-28",
        "durationDays": 6,
        "status": "SCHEDULED",
        "room": "Atelier Digital Lab",
    },
    {
        "id": "SES-2026-05",
        "title": "Leadership & Management d'Équipe Industrielle",
        "trainerName": "Youssef Benali",
        "trainerDomain": "Soft Skills",
        "center": "Ben Guerir",
        "startDate": "2026-08-25",
        "endDate": "2026-08-29",
        "durationDays": 4,
        "status": "CONFIRMED",
        "room": "Salle Innovation A1",
    },
    {
        "id": "SES-2026-06",
        "title": "Techniques d'Extraction & Valorisation Minière",
        "trainerName": "Fatima Zahra El Idrissi",
        "trainerDomain": "Industrie minière",
        "center": "Khouribga",
        "startDate": "2026-09-02",
        "endDate": "2026-09-10",
        "durationDays": 8,
        "status": "CONFIRMED",
        "room": "Salle Extraction 1",
        "coTrainerName": "Karim Tazi",
    },
]

def _to_dict(s: models.PlanningSession):
    return {
        "id": s.id,
        "title": s.title,
        "trainerName": s.trainer_name,
        "trainerDomain": s.trainer_domain,
        "center": s.center,
        "startDate": s.start_date,
        "endDate": s.end_date,
        "durationDays": s.duration_days,
        "status": s.status,
        "room": s.room,
        "coTrainerName": s.co_trainer_name,
    }

@router.get("/")
def get_sessions(db: Session = Depends(get_db)):
    try:
        db_sessions = db.query(models.PlanningSession).all()
        if not db_sessions:
            for s_data in DEFAULT_DEMO_SESSIONS:
                db_s = models.PlanningSession(
                    id=s_data["id"],
                    title=s_data["title"],
                    trainer_name=s_data["trainerName"],
                    trainer_domain=s_data["trainerDomain"],
                    center=s_data["center"],
                    start_date=s_data["startDate"],
                    end_date=s_data["endDate"],
                    duration_days=s_data["durationDays"],
                    status=s_data["status"],
                    room=s_data.get("room"),
                    co_trainer_name=s_data.get("coTrainerName"),
                )
                db.add(db_s)
            db.commit()
            db_sessions = db.query(models.PlanningSession).all()
        return [_to_dict(s) for s in db_sessions]
    except Exception as e:
        print("Error fetching sessions:", e)
        return DEFAULT_DEMO_SESSIONS

@router.post("/")
def create_session(data: schemas.PlanningSessionCreate, db: Session = Depends(get_db)):
    session_id = data.id
    if not session_id:
        count = db.query(models.PlanningSession).count()
        session_id = f"SES-2026-{str(count + 1).zfill(2)}"

    existing = db.query(models.PlanningSession).filter(models.PlanningSession.id == session_id).first()
    if existing:
        count = db.query(models.PlanningSession).count()
        session_id = f"SES-2026-{str(count + 100).zfill(2)}"

    new_session = models.PlanningSession(
        id=session_id,
        title=data.title,
        trainer_name=data.trainerName,
        trainer_domain=data.trainerDomain,
        center=data.center,
        start_date=data.startDate,
        end_date=data.endDate,
        duration_days=data.durationDays,
        status=data.status,
        room=data.room,
        co_trainer_name=data.coTrainerName,
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return _to_dict(new_session)

@router.put("/{session_id}")
def update_session(session_id: str, data: schemas.PlanningSessionUpdate, db: Session = Depends(get_db)):
    db_session = db.query(models.PlanningSession).filter(models.PlanningSession.id == session_id).first()
    if not db_session:
        raise HTTPException(status_code=404, detail="Session non trouvée")

    if data.title is not None: db_session.title = data.title
    if data.trainerName is not None: db_session.trainer_name = data.trainerName
    if data.trainerDomain is not None: db_session.trainer_domain = data.trainerDomain
    if data.center is not None: db_session.center = data.center
    if data.startDate is not None: db_session.start_date = data.startDate
    if data.endDate is not None: db_session.end_date = data.endDate
    if data.durationDays is not None: db_session.duration_days = data.durationDays
    if data.status is not None: db_session.status = data.status
    if data.room is not None: db_session.room = data.room
    if data.coTrainerName is not None: db_session.co_trainer_name = data.coTrainerName

    db.commit()
    db.refresh(db_session)
    return _to_dict(db_session)

@router.delete("/{session_id}")
def delete_session(session_id: str, db: Session = Depends(get_db)):
    db_session = db.query(models.PlanningSession).filter(models.PlanningSession.id == session_id).first()
    if not db_session:
        raise HTTPException(status_code=404, detail="Session non trouvée")

    db.delete(db_session)
    db.commit()
    return {"message": "Session supprimée avec succès", "id": session_id}
