from sqlalchemy.orm import Session

from backend.database import SessionLocal
from backend.models.user import User
from backend.security.password import hash_password


def seed_system():

    db: Session = SessionLocal()

    try:

        admin = db.query(User).filter(
            User.email == "admin@csss.com"
        ).first()

        if admin:

            print("System already seeded")
            return

        print("Seeding users...")

        admin = User(

            name="System Admin",

            email="admin@csss.com",

            password=hash_password("Admin123"),

            role="admin"

        )

        doctor = User(

            name="Test Doctor",

            email="doctor@csss.com",

            password=hash_password("Doctor123"),

            role="doctor"

        )

        pharmacist = User(

            name="Test Pharmacist",

            email="pharma@csss.com",

            password=hash_password("Pharma123"),

            role="pharmacist"

        )

        patient = User(

            name="Test Patient",

            email="patient@csss.com",

            password=hash_password("Patient123"),

            role="patient"

        )

        db.add_all([
            admin,
            doctor,
            pharmacist,
            patient
        ])

        db.commit()

        print("SUCCESS: All 4 users created")
        print("  admin@csss.com   / Admin123")
        print("  doctor@csss.com  / Doctor123")
        print("  pharma@csss.com  / Pharma123")
        print("  patient@csss.com / Patient123")

    finally:

        db.close()


if __name__ == "__main__":

    seed_system()