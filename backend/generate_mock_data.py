from faker import Faker
from database import SessionLocal
import models

# Initialisation de Faker (en français pour plus de réalisme)
fake = Faker('fr_FR')

def create_fake_trainers(n=50):
    db = SessionLocal()
    print(f"Génération de {n} formateurs en cours...")
    
    try:
        trainer_role = db.query(models.Role).filter(models.Role.nom_role == "Formateur").first()
        if trainer_role is None:
            trainer_role = models.Role(nom_role="Formateur")
            db.add(trainer_role)
            db.flush()

        for _ in range(n):
            # Création d'un utilisateur fictif
            user = models.User(
                employee_id=f"EMP{fake.unique.random_number(digits=4)}",
                email=fake.unique.company_email(),
                password_hash="hashed_password_123", # Simplifié pour l'exemple
                role_id=trainer_role.id,
                is_active=True
            )
            db.add(user)
            db.flush() # flush() permet d'obtenir l'ID de l'user avant le commit final
            # Création du profil associé (si tu as la table Profile dans tes models)
            # Cette partie dépend des champs exacts de ton models.py
            profile = models.Profile(
                user_id=user.id,
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                job_title="Formateur Interne",
                hire_date=fake.date_between(start_date='-5y', end_date='today')
            )
            db.add(profile)

        # Validation de toutes les insertions
        db.commit()
        print(f"Succès ! {n} formateurs ont été injectés dans PostgreSQL.")
    except Exception as e:
        db.rollback()
        print(f"Erreur lors de l'insertion : {e}")
    finally:
        db.close()

if __name__ == "__main__":
    # Lancement de la fonction lors de l'exécution du script
    create_fake_trainers(20)