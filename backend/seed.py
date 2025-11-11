from app.db import SessionLocal, engine, Base
from app.models import Student, Subject, Grade

def seed():
    # Crea las tablas solo si no estás usando Alembic
    print("Seed: starting...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Evita duplicar datos
        if db.query(Student).count() > 0:
            print('Seed: data already present, skipping.')
            return

        # Crear estudiantes
        s1 = Student(name='Juan Perez', email='juan.perez@example.com')
        s2 = Student(name='Maria Lopez', email='maria.lopez@example.com')
        db.add_all([s1, s2])
        db.commit()
        db.refresh(s1)
        db.refresh(s2)

        # Crear materias
        m1 = Subject(name='Matemáticas')
        m2 = Subject(name='Historia')
        db.add_all([m1, m2])
        db.commit()
        db.refresh(m1)
        db.refresh(m2)

        # Crear calificaciones
        g1 = Grade(student_id=s1.id, subject_id=m1.id, grade=4.5)
        g2 = Grade(student_id=s2.id, subject_id=m2.id, grade=3.8)
        db.add_all([g1, g2])
        db.commit()

        print('Seed: done ✅')
    except Exception as e:
        print(f'Seed error ❌: {e}')
        db.rollback()
    finally:
        db.close()

if __name__ == '__main__':
    seed()
