from sqlalchemy import Column, Integer, String, ForeignKey, Float, UniqueConstraint
from sqlalchemy.orm import relationship
from .db import Base

class Estudiante(Base):
    __tablename__ = 'estudiantes'
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(200), nullable=False)
    email = Column(String(200), unique=True, nullable=True)

    notas = relationship('Nota', back_populates='estudiante', cascade='all, delete-orphan')


class Materia(Base):
    __tablename__ = 'materias'
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(200), unique=True, nullable=False)

    notas = relationship('Nota', back_populates='materia', cascade='all, delete-orphan')


class Nota(Base):
    __tablename__ = 'notas'
    id = Column(Integer, primary_key=True, index=True)
    estudiante_id = Column(Integer, ForeignKey('estudiantes.id'), nullable=False)
    materia_id = Column(Integer, ForeignKey('materias.id'), nullable=False)
    nota = Column(Float, nullable=False)

    estudiante = relationship('Estudiante', back_populates='notas')
    materia = relationship('Materia', back_populates='notas')

    __table_args__ = (UniqueConstraint('estudiante_id', 'materia_id', name='uix_estudiante_materia'),)
