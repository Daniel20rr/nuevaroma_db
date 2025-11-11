from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from . import models, schemas, crud, db
from .db import Base, engine, get_session
import os

app = FastAPI(title="nuevaroma_db - backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/health')
def health():
    return {"status":"ok"}

# Students
@app.post('/students/', response_model=schemas.StudentOut)
def create_student(student: schemas.StudentCreate, session=Depends(get_session)):
    return crud.create_student(session, student)

@app.get('/students/', response_model=list[schemas.StudentOut])
def list_students(q: str = None, session=Depends(get_session)):
    return crud.list_students(session, q)

@app.get('/students/{student_id}', response_model=schemas.StudentOut)
def get_student(student_id: int, session=Depends(get_session)):
    student = crud.get_student(session, student_id)
    if not student:
        raise HTTPException(status_code=404, detail='Student not found')
    return student

@app.put('/students/{student_id}', response_model=schemas.StudentOut)
def update_student(student_id: int, data: schemas.StudentUpdate, session=Depends(get_session)):
    return crud.update_student(session, student_id, data)

@app.delete('/students/{student_id}')
def delete_student(student_id: int, session=Depends(get_session)):
    crud.delete_student(session, student_id)
    return {"detail":"deleted"}

# Subjects
@app.post('/subjects/', response_model=schemas.SubjectOut)
def create_subject(subject: schemas.SubjectCreate, session=Depends(get_session)):
    return crud.create_subject(session, subject)

@app.get('/subjects/', response_model=list[schemas.SubjectOut])
def list_subjects(session=Depends(get_session)):
    return crud.list_subjects(session)

# Grades (Notas)
@app.post('/grades/', response_model=schemas.GradeOut)
def create_grade(grade: schemas.GradeCreate, session=Depends(get_session)):
    return crud.create_grade(session, grade)

@app.get('/grades/', response_model=list[schemas.GradeOut])
def list_grades(student_id: int = None, session=Depends(get_session)):
    return crud.list_grades(session, student_id)
