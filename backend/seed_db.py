import os, hashlib, models
from database import SessionLocal, engine, Base

def _hash(p: str) -> str:
    return hashlib.sha256((p + os.environ.get("JWT_SECRET_KEY", "default_jwt_secret_trainer_capacity_hub_2026")).encode()).hexdigest()

def seed():
    print("[INFO] Initialisation de la base de donnees via seed_db.py...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        roles = {r: db.query(models.Role).filter_by(nom_role=r).first() or models.Role(nom_role=r) for r in ["Administrateur", "Manager", "Formateur", "Planificateur"]}
        centers = {c: db.query(models.Center).filter_by(nom_centre=c).first() or models.Center(nom_centre=c) for c in ["Ben Guerir", "Safi", "Jorf Lasfar", "Khouribga"]}
        specs = {s: db.query(models.Specialty).filter_by(nom_specialite=s).first() or models.Specialty(nom_specialite=s) for s in ["Digital & Data", "HSE & Sécurité", "Maintenance Industrielle", "Chimie et procédés", "Industrie minière", "Soft Skills"]}
        
        for obj in list(roles.values()) + list(centers.values()) + list(specs.values()):
            db.add(obj)
        for name, neutral in [("Animation", False), ("Préparation & Ingénierie", False), ("Visite Terrain", False), ("Mission Inter-Centres", False), ("Congé / Indisponibilité", True)]:
            if not db.query(models.ActivityType).filter_by(nom_type=name).first():
                db.add(models.ActivityType(nom_type=name, est_neutralise=neutral))
        db.flush()

        pwd_hash = _hash("password123")
        users = [
            ("ADM-001", "hibabelmoumene05@gmail.com", "Administrateur", "Hiba", "Belmoumene", "Administrateur Système", "Ben Guerir", "Digital & Data", "+212 6 12 34 56 78"),
            ("EMP-077", "hiba.aitbelmoumene-ext@um6p.ma", "Formateur", "Hiba", "AIT BELMOUMENE", "Formateur HSE", "Ben Guerir", "HSE & Sécurité", "+212 6 98 76 54 32"),
            ("MGR-001", "manager@um6p.ma", "Manager", "Soufiane", "ARROUB", "Planning & Capacity Manager", "Ben Guerir", "Digital & Data", "+212 6 11 22 33 44"),
            ("PLN-001", "planificateur@um6p.ma", "Planificateur", "Karim", "TAZI", "Coordinateur des Plannings", "Safi", "Maintenance Industrielle", "+212 6 55 66 77 88"),
            ("ADM-000", "admin@um6p.ma", "Administrateur", "Admin", "TechniX", "Super Administrateur", "Ben Guerir", "Digital & Data", "+212 5 25 00 00 00")
        ]

        for emp_id, email, r_name, first, last, title, center, spec, phone in users:
            u = db.query(models.User).filter_by(email=email).first()
            if not u:
                u = models.User(employee_id=emp_id, email=email, password_hash=pwd_hash, role_id=roles[r_name].id, is_active=True)
                db.add(u)
                db.flush()
            else:
                u.password_hash, u.role_id, u.is_active, u.employee_id = pwd_hash, roles[r_name].id, True, emp_id

            p = u.profile or models.Profile(user_id=u.id)
            p.first_name, p.last_name, p.job_title = first, last, title
            p.home_center_id, p.specialty_id, p.phone = centers[center].id, specs[spec].id, phone
            db.add(p)

        db.commit()
        print("[SUCCESS] Base de donnees initialisee avec succes !")
    except Exception as e:
        db.rollback()
        print(f"[ERROR] Erreur seed : {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
