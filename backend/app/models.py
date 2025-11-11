from sqlalchemy import Column, Integer, String, ForeignKey, Float, UniqueConstraint
from sqlalchemy.orm import relationship
from .db import Base

class Student(Base):
    __tablename__ = 'students'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    email = Column(String(200), unique=True, nullable=True)

    grades = relationship('Grade', back_populates='student', cascade='all, delete-orphan')

class Subject(Base):
    __tablename__ = 'subjects'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), unique=True, nullable=False)

    grades = relationship('Grade', back_populates='subject', cascade='all, delete-orphan')

class Grade(Base):
    __tablename__ = 'grades'
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey('students.id'), nullable=False)
    subject_id = Column(Integer, ForeignKey('subjects.id'), nullable=False)
    grade = Column(Float, nullable=False)

    student = relationship('Student', back_populates='grades')
    subject = relationship('Subject', back_populates='grades')

    __table_args__ = (UniqueConstraint('student_id','subject_id', name='uix_student_subject'),)
