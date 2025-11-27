from sqlalchemy import Column, Integer, String, ForeignKey, Float, UniqueConstraint, Boolean, Date, Table
from sqlalchemy.orm import relationship
from .db import Base

# ============================================
# MODELOS EXISTENTES
# ============================================

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
    
    # ⭐ NUEVA RELACIÓN con Profesores
    profesores = relationship(
        'Profesor',
        secondary='profesor_materia',
        back_populates='materias'
    )


class Nota(Base):
    __tablename__ = 'notas'
    id = Column(Integer, primary_key=True, index=True)
    estudiante_id = Column(Integer, ForeignKey('estudiantes.id'), nullable=False)
    materia_id = Column(Integer, ForeignKey('materias.id'), nullable=False)
    nota = Column(Float, nullable=False)

    estudiante = relationship('Estudiante', back_populates='notas')
    materia = relationship('Materia', back_populates='notas')

    __table_args__ = (UniqueConstraint('estudiante_id', 'materia_id', name='uix_estudiante_materia'),)


# ============================================
# NUEVOS MODELOS - PROFESORES
# ============================================

# Tabla intermedia para relación muchos a muchos Profesor-Materia
profesor_materia = Table(
    'profesor_materia',
    Base.metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('profesor_id', Integer, ForeignKey('profesores.id', ondelete='CASCADE'), nullable=False),
    Column('materia_id', Integer, ForeignKey('materias.id', ondelete='CASCADE'), nullable=False),
    UniqueConstraint('profesor_id', 'materia_id', name='uix_profesor_materia')
)


class Profesor(Base):
    __tablename__ = 'profesores'
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False, index=True)
    apellido = Column(String(100), nullable=False, index=True)
    email = Column(String(150), unique=True, nullable=False, index=True)
    telefono = Column(String(20), nullable=True)
    especialidad = Column(String(100), nullable=True)
    fecha_contratacion = Column(Date, nullable=True)
    activo = Column(Boolean, default=True, index=True)
    
    # Relación muchos a muchos con Materias
    materias = relationship(
        'Materia',
        secondary=profesor_materia,
        back_populates='profesores'
    )