import re
import unicodedata
from faker import Faker
from database import SessionLocal
import models

fake = Faker('fr_FR')


def slugify(text: str) -> str:
    text = unicodedata.normalize('NFKD', text).encode('ASCII', 'ignore').decode('utf-8')
    return re.sub(r'[^a-zA-Z0-9]', '', text).lower()


def create_fake_trainers(n=50):
    db = SessionLocal()
    print(f"Génération de {n} formateurs en cours...")

    try:
        trainer_role = db.query(models.Role).filter(models.Role.nom_role == "Formateur").first()
        if trainer_role is None:
            trainer_role = models.Role(nom_role="Formateur")
            db.add(trainer_role)
            db.flush()

        used_emails = set()

        for _ in range(n):
            first_name = fake.first_name()
            last_name = fake.last_name()

            clean_first = slugify(first_name)
            clean_last = slugify(last_name)
            base_email = f"{clean_first}.{clean_last}@um6p.ma"
            email = base_email
            counter = 1
            while email in used_emails or db.query(models.User).filter(models.User.email == email).first():
                email = f"{clean_first}.{clean_last}{counter}@um6p.ma"
                counter += 1
            used_emails.add(email)

            user = models.User(
                employee_id=f"EMP{fake.unique.random_number(digits=4)}",
                email=email,
                password_hash="hashed_password_123",
                role_id=trainer_role.id,
                is_active=True,
            )
            db.add(user)
            db.flush()

            profile = models.Profile(
                user_id=user.id,
                first_name=first_name,
                last_name=last_name,
                job_title="Formateur Interne",
                hire_date=fake.date_between(start_date='-5y', end_date='today'),
            )
            db.add(profile)

        db.commit()
        print(f"Succès ! {n} formateurs ont été injectés dans PostgreSQL.")
    except Exception as e:
        db.rollback()
        print(f"Erreur lors de l'insertion : {e}")
    finally:
        db.close()


def fix_all_user_emails():
    db = SessionLocal()
    try:
        users = db.query(models.User).all()
        updated_count = 0
        for u in users:
            profile = getattr(u, "profile", None)
            if profile and profile.first_name and profile.last_name:
                clean_first = slugify(profile.first_name)
                clean_last = slugify(profile.last_name)
                target_email = f"{clean_first}.{clean_last}@um6p.ma"
            else:
                prefix = u.email.split("@")[0] if "@" in u.email else u.email
                prefix = slugify(prefix) or "user"
                target_email = f"{prefix}@um6p.ma"

            if u.email != target_email:
                counter = 1
                new_email = target_email
                while db.query(models.User).filter(models.User.email == new_email, models.User.id != u.id).first():
                    base_prefix = target_email.split("@")[0]
                    new_email = f"{base_prefix}{counter}@um6p.ma"
                    counter += 1
                u.email = new_email
                updated_count += 1
        if updated_count > 0:
            db.commit()
            print(f"Correction de la base de données : {updated_count} emails synchros avec les noms vers @um6p.ma")
    except Exception as e:
        db.rollback()
        print(f"Erreur lors de la correction des emails dans la DB : {e}")
    finally:
        db.close()


if __name__ == "__main__":
    fix_all_user_emails()
