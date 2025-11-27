# backend/app/crud.py
from sqlalchemy.orm import Session
from fastapi import HTTPException
from . import models, schemas
from sqlalchemy import or_

# ==================== ESTUDIANTES ====================
def crear_estudiante(session: Session, estudiante: schemas.EstudianteCreate):
    db_estudiante = session.query(models.Estudiante).filter(
        models.Estudiante.email == estudiante.email
    ).first()
    if db_estudiante:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    
    nuevo = models.Estudiante(**estudiante.model_dump())
    session.add(nuevo)
    session.commit()
    session.refresh(nuevo)
    return nuevo

def listar_estudiantes(session: Session, q: str = None):
    query = session.query(models.Estudiante)
    if q:
        query = query.filter(
            or_(
                models.Estudiante.nombre.ilike(f"%{q}%"),
                models.Estudiante.email.ilike(f"%{q}%")
            )
        )
    return query.all()

def obtener_estudiante(session: Session, estudiante_id: int):
    return session.query(models.Estudiante).filter(
        models.Estudiante.id == estudiante_id
    ).first()

def actualizar_estudiante(session: Session, estudiante_id: int, data: schemas.EstudianteUpdate):
    estudiante = obtener_estudiante(session, estudiante_id)
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(estudiante, key, value)
    
    session.commit()
    session.refresh(estudiante)
    return estudiante

def eliminar_estudiante(session: Session, estudiante_id: int):
    estudiante = obtener_estudiante(session, estudiante_id)
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    session.delete(estudiante)
    session.commit()

# ==================== MATERIAS ====================
def crear_materia(session: Session, materia: schemas.MateriaCreate):
    db_materia = session.query(models.Materia).filter(
        models.Materia.nombre == materia.nombre
    ).first()
    if db_materia:
        raise HTTPException(status_code=400, detail="Materia ya existe")
    
    nueva = models.Materia(**materia.model_dump())
    session.add(nueva)
    session.commit()
    session.refresh(nueva)
    return nueva

def listar_materias(session: Session):
    return session.query(models.Materia).all()

# ==================== PROFESORES ====================
def crear_profesor(session: Session, profesor: schemas.ProfesorCreate):
    """Crear un nuevo profesor"""
    # Verificar si el email ya existe
    db_profesor = session.query(models.Profesor).filter(
        models.Profesor.email == profesor.email
    ).first()
    
    if db_profesor:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    
    nuevo_profesor = models.Profesor(**profesor.model_dump())
    session.add(nuevo_profesor)
    session.commit()
    session.refresh(nuevo_profesor)
    return nuevo_profesor

def listar_profesores(session: Session, q: str = None, activos_solo: bool = True):
    """Listar profesores con búsqueda opcional"""
    query = session.query(models.Profesor)
    
    # Filtrar solo activos si se solicita
    if activos_solo:
        query = query.filter(models.Profesor.activo == True)
    
    # Búsqueda por texto
    if q:
        query = query.filter(
            or_(
                models.Profesor.nombre.ilike(f"%{q}%"),
                models.Profesor.apellido.ilike(f"%{q}%"),
                models.Profesor.email.ilike(f"%{q}%"),
                models.Profesor.especialidad.ilike(f"%{q}%")
            )
        )
    
    return query.all()

def obtener_profesor(session: Session, profesor_id: int):
    """Obtener un profesor por ID"""
    profesor = session.query(models.Profesor).filter(
        models.Profesor.id == profesor_id
    ).first()
    
    if not profesor:
        raise HTTPException(status_code=404, detail="Profesor no encontrado")
    
    return profesor

def actualizar_profesor(session: Session, profesor_id: int, data: schemas.ProfesorUpdate):
    """Actualizar información de un profesor"""
    profesor = obtener_profesor(session, profesor_id)
    
    # Si se actualiza el email, verificar que no esté en uso
    if data.email and data.email != profesor.email:
        email_existe = session.query(models.Profesor).filter(
            models.Profesor.email == data.email,
            models.Profesor.id != profesor_id
        ).first()
        
        if email_existe:
            raise HTTPException(status_code=400, detail="Email ya registrado por otro profesor")
    
    # Actualizar campos
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(profesor, key, value)
    
    session.commit()
    session.refresh(profesor)
    return profesor

def eliminar_profesor(session: Session, profesor_id: int, hard_delete: bool = False):
    """
    Eliminar un profesor
    - hard_delete=False: Soft delete (marca como inactivo)
    - hard_delete=True: Eliminación física
    """
    profesor = obtener_profesor(session, profesor_id)
    
    if hard_delete:
        # Eliminación física
        session.delete(profesor)
        session.commit()
        return {"detail": "Profesor eliminado permanentemente"}
    else:
        # Soft delete
        profesor.activo = False
        session.commit()
        return {"detail": "Profesor marcado como inactivo"}

# ========== RELACIONES PROFESORES-MATERIAS ==========
def listar_materias_profesor(session: Session, profesor_id: int):
    """Obtener todas las materias de un profesor"""
    profesor = obtener_profesor(session, profesor_id)
    return profesor.materias

def asignar_materia_profesor(session: Session, profesor_id: int, materia_id: int):
    """Asignar una materia a un profesor"""
    profesor = obtener_profesor(session, profesor_id)
    
    materia = session.query(models.Materia).filter(
        models.Materia.id == materia_id
    ).first()
    
    if not materia:
        raise HTTPException(status_code=404, detail="Materia no encontrada")
    
    # Verificar si ya está asignada
    if materia in profesor.materias:
        raise HTTPException(status_code=400, detail="Materia ya asignada a este profesor")
    
    profesor.materias.append(materia)
    session.commit()
    
    return {
        "detail": "Materia asignada exitosamente",
        "profesor_id": profesor_id,
        "materia_id": materia_id
    }

def remover_materia_profesor(session: Session, profesor_id: int, materia_id: int):
    """Remover una materia de un profesor"""
    profesor = obtener_profesor(session, profesor_id)
    
    materia = session.query(models.Materia).filter(
        models.Materia.id == materia_id
    ).first()
    
    if not materia:
        raise HTTPException(status_code=404, detail="Materia no encontrada")
    
    # Verificar si está asignada
    if materia not in profesor.materias:
        raise HTTPException(
            status_code=400,
            detail="Esta materia no está asignada al profesor"
        )
    
    profesor.materias.remove(materia)
    session.commit()
    
    return {
        "detail": "Materia removida exitosamente",
        "profesor_id": profesor_id,
        "materia_id": materia_id
    }

def listar_profesores_materia(session: Session, materia_id: int):
    """Obtener todos los profesores que dictan una materia"""
    materia = session.query(models.Materia).filter(
        models.Materia.id == materia_id
    ).first()
    
    if not materia:
        raise HTTPException(status_code=404, detail="Materia no encontrada")
    
    return materia.profesores

# ==================== NOTAS ====================
def crear_nota(session: Session, nota: schemas.NotaCreate):
    estudiante_id = nota.estudiante_id
    materia_id = nota.materia_id
    
    # Validar estudiante
    estudiante = session.query(models.Estudiante).filter(
        models.Estudiante.id == estudiante_id
    ).first()
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    
    # Validar materia
    materia = session.query(models.Materia).filter(
        models.Materia.id == materia_id
    ).first()
    if not materia:
        raise HTTPException(status_code=404, detail="Materia no encontrada")
    
    nueva_nota = models.Nota(
        nota=nota.nota,
        estudiante_id=estudiante_id,
        materia_id=materia_id
    )
    session.add(nueva_nota)
    session.commit()
    session.refresh(nueva_nota)
    return nueva_nota

def listar_notas(session: Session, estudiante_id: int = None):
    query = session.query(models.Nota)
    if estudiante_id:
        query = query.filter(models.Nota.estudiante_id == estudiante_id)
    return query.all()

def actualizar_nota(session: Session, nota_id: int, data: schemas.NotaUpdate):
    nota = session.query(models.Nota).filter(models.Nota.id == nota_id).first()
    if not nota:
        raise HTTPException(status_code=404, detail="Nota no encontrada")
    
    if data.nota is not None:
        nota.nota = data.nota
    
    session.commit()
    session.refresh(nota)
    return nota

def eliminar_nota(session: Session, nota_id: int):
    nota = session.query(models.Nota).filter(models.Nota.id == nota_id).first()
    if not nota:
        raise HTTPException(status_code=404, detail="Nota no encontrada")
    session.delete(nota)
    session.commit()