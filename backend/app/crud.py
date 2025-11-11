from sqlalchemy.orm import Session
from . import models, schemas
from sqlalchemy import or_

def create_student(db: Session, student: schemas.StudentCreate):
    db_student = models.Student(name=student.name, email=student.email)
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

def list_students(db: Session, q: str = None):
    query = db.query(models.Student)
    if q:
        qlike = f"%{q}%"
        query = query.filter(or_(models.Student.name.like(qlike), models.Student.email.like(qlike)))
    return query.all()

def get_student(db: Session, student_id: int):
    return db.query(models.Student).filter(models.Student.id==student_id).first()

def update_student(db: Session, student_id: int, data: schemas.StudentUpdate):
    student = get_student(db, student_id)
    if not student:
        raise Exception('Student not found')
    if data.name is not None:
        student.name = data.name
    if data.email is not None:
        student.email = data.email
    db.add(student)
    db.commit()
    db.refresh(student)
    return student

def delete_student(db: Session, student_id: int):
    student = get_student(db, student_id)
    if student:
        db.delete(student)
        db.commit()

def create_subject(db: Session, subject: schemas.SubjectCreate):
    s = models.Subject(name=subject.name)
    db.add(s)
    db.commit()
    db.refresh(s)
    return s

def list_subjects(db: Session):
    return db.query(models.Subject).all()

def create_grade(db: Session, grade: schemas.GradeCreate):
    g = models.Grade(student_id=grade.student_id, subject_id=grade.subject_id, grade=grade.grade)
    db.add(g)
    db.commit()
    db.refresh(g)
    return g

def list_grades(db: Session, student_id: int = None):
    q = db.query(models.Grade)
    if student_id:
        q = q.filter(models.Grade.student_id==student_id)
    return q.all()
