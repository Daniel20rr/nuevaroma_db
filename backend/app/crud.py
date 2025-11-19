from sqlalchemy.orm import Session
from fastapi import HTTPException
from sqlalchemy import or_
from . import models, schemas


# =====================================================
# ================ CRUD ESTUDIANTES ===================
# =====================================================

def crear_estudiante(db: Session, estudiante: schemas.EstudianteCreate):
    try:
        existe = db.query(models.Estudiante).filter(
            or_(
                models.Estudiante.email == estudiante.email,
                models.Estudiante.nombre == estudiante.nombre
            )
        ).first()

        if existe:
            raise HTTPException(
                status_code=400,
                detail=f"El estudiante '{estudiante.nombre}' o el correo '{estudiante.email}' ya existe."
            )

        db_est = models.Estudiante(
            nombre=estudiante.nombre.strip(),
            email=estudiante.email.strip() if estudiante.email else None
        )
        db.add(db_est)
        db.commit()
        db.refresh(db_est)
        return db_est

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear estudiante: {str(e)}")


def listar_estudiantes(db: Session, q: str = None):
    query = db.query(models.Estudiante)

    if q:
        qlike = f"%{q}%"
        query = query.filter(
            or_(
                models.Estudiante.nombre.like(qlike),
                models.Estudiante.email.like(qlike)
            )
        )

    return query.all()


def obtener_estudiante(db: Session, estudiante_id: int):
    est = db.query(models.Estudiante).filter(models.Estudiante.id == estudiante_id).first()
    if not est:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    return est


def actualizar_estudiante(db: Session, estudiante_id: int, data: schemas.EstudianteUpdate):
    est = obtener_estudiante(db, estudiante_id)
    try:
        if data.nombre:
            est.nombre = data.nombre.strip()

        if data.email:
            existe = db.query(models.Estudiante).filter(
                models.Estudiante.email == data.email,
                models.Estudiante.id != estudiante_id
            ).first()

            if existe:
                raise HTTPException(
                    status_code=400,
                    detail=f"El correo '{data.email}' ya está registrado en otro estudiante."
                )

            est.email = data.email.strip()

        db.commit()
        db.refresh(est)
        return est

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al actualizar estudiante: {str(e)}")


def eliminar_estudiante(db: Session, estudiante_id: int):
    est = obtener_estudiante(db, estudiante_id)
    try:
        db.delete(est)
        db.commit()
        return {"detail": "Estudiante eliminado"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al eliminar estudiante: {str(e)}")


# =====================================================
# ================ CRUD MATERIAS ======================
# =====================================================

def crear_materia(db: Session, materia: schemas.MateriaCreate):
    try:
        existe = db.query(models.Materia).filter(
            models.Materia.nombre == materia.nombre
        ).first()

        if existe:
            raise HTTPException(status_code=400, detail="La materia ya existe")

        m = models.Materia(nombre=materia.nombre.strip())
        db.add(m)
        db.commit()
        db.refresh(m)
        return m

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear materia: {str(e)}")


def listar_materias(db: Session):
    return db.query(models.Materia).all()


def obtener_materia(db: Session, materia_id: int):
    """Obtiene una materia por ID"""
    materia = db.query(models.Materia).filter(models.Materia.id == materia_id).first()
    if not materia:
        raise HTTPException(status_code=404, detail="Materia no encontrada")
    return materia


# =====================================================
# ===================== CRUD NOTAS ====================
# =====================================================

def crear_nota(db: Session, nota: schemas.NotaCreate):
    try:
        estudiante = db.query(models.Estudiante).filter(
            models.Estudiante.id == nota.estudiante_id
        ).first()
        if not estudiante:
            raise HTTPException(status_code=404, detail="Estudiante no encontrado")

        materia = db.query(models.Materia).filter(
            models.Materia.id == nota.materia_id
        ).first()
        if not materia:
            raise HTTPException(status_code=404, detail="Materia no encontrada")

        n = models.Nota(
            estudiante_id=nota.estudiante_id,
            materia_id=nota.materia_id,
            nota=nota.nota
        )

        db.add(n)
        db.commit()
        db.refresh(n)
        return n

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear nota: {str(e)}")


def listar_notas(db: Session, estudiante_id: int = None):
    q = db.query(models.Nota)

    if estudiante_id is not None:
        q = q.filter(models.Nota.estudiante_id == estudiante_id)

    return q.all()


def actualizar_nota(db: Session, nota_id: int, data: schemas.NotaUpdate):
    """Actualiza una nota existente"""
    nota = db.query(models.Nota).filter(models.Nota.id == nota_id).first()
    
    if not nota:
        raise HTTPException(status_code=404, detail="Nota no encontrada")
    
    try:
        if data.estudiante_id is not None:
            # Verificar que existe el estudiante
            estudiante = obtener_estudiante(db, data.estudiante_id)
            nota.estudiante_id = data.estudiante_id
        
        if data.materia_id is not None:
            # Verificar que existe la materia
            materia = obtener_materia(db, data.materia_id)
            nota.materia_id = data.materia_id
        
        if data.nota is not None:
            nota.nota = data.nota
        
        db.commit()
        db.refresh(nota)
        return nota
    
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al actualizar nota: {str(e)}")


def eliminar_nota(db: Session, nota_id: int):
    """Elimina una nota por ID"""
    nota = db.query(models.Nota).filter(models.Nota.id == nota_id).first()
    
    if not nota:
        raise HTTPException(status_code=404, detail="Nota no encontrada")
    
    try:
        db.delete(nota)
        db.commit()
        return {"detail": "Nota eliminada"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al eliminar nota: {str(e)}")


# =====================================================
# =============== MÓDULO EXCEL (NUEVO) ================
# =====================================================

def existe_estudiante_por_email(db: Session, email: str):
    """Devuelve True si existe un estudiante con ese email."""
    return db.query(models.Estudiante).filter(models.Estudiante.email == email).first()


def insertar_estudiantes_desde_excel(db: Session, lista_estudiantes: list):
    """
    Inserta estudiantes desde el Excel (ya validado en el endpoint).
    lista_estudiantes: [{'nombre': 'Juan', 'email': 'j@x.com'}, ...]
    """
    
    total_insertados = 0
    total_existentes = 0

    for item in lista_estudiantes:
        nombre = item.get("nombre", "").strip()
        email = item.get("email", "").strip()

        if not nombre or not email:
            continue

        existe = existe_estudiante_por_email(db, email)

        if existe:
            total_existentes += 1
            continue

        nuevo = models.Estudiante(nombre=nombre, email=email)
        db.add(nuevo)
        total_insertados += 1

    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al insertar desde Excel: {str(e)}")

    return total_insertados, total_existentes