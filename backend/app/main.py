from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from . import models, schemas, crud
from .db import Base, engine, get_session
from .state import cached_sheets
import pandas as pd
import io
import asyncio
from sqlalchemy import func

app = FastAPI(title="nuevaroma_db - backend")

# =====================================================
# ============ CORS CONFIGURATION ====================
# =====================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://localhost:80",
        "http://localhost:4200",
        "http://localhost:8080",
        "http://127.0.0.1",
        "http://127.0.0.1:80",
        "http://127.0.0.1:4200",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600
)

# =====================================================
# ==================== DATABASE ======================
# =====================================================
Base.metadata.create_all(bind=engine)

# =====================================================
# =================== HEALTH CHECK ===================
# =====================================================
@app.get("/health")
def health():
    return {"status": "ok", "message": "API funcionando correctamente"}

# =====================================================
# ================= CRUD ESTUDIANTES =================
# =====================================================
@app.post("/estudiantes/", response_model=schemas.EstudianteOut)
def crear_estudiante(estudiante: schemas.EstudianteCreate, session=Depends(get_session)):
    return crud.crear_estudiante(session, estudiante)

@app.get("/estudiantes/", response_model=list[schemas.EstudianteOut])
def listar_estudiantes(q: str = None, session=Depends(get_session)):
    return crud.listar_estudiantes(session, q)

@app.get("/estudiantes/{estudiante_id}", response_model=schemas.EstudianteOut)
def obtener_estudiante(estudiante_id: int, session=Depends(get_session)):
    estudiante = crud.obtener_estudiante(session, estudiante_id)
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    return estudiante

@app.put("/estudiantes/{estudiante_id}", response_model=schemas.EstudianteOut)
def actualizar_estudiante(estudiante_id: int, data: schemas.EstudianteUpdate, session=Depends(get_session)):
    return crud.actualizar_estudiante(session, estudiante_id, data)

@app.delete("/estudiantes/{estudiante_id}")
def eliminar_estudiante(estudiante_id: int, session=Depends(get_session)):
    crud.eliminar_estudiante(session, estudiante_id)
    return {"detail": "Eliminado"}

# =====================================================
# ================= CRUD MATERIAS ===================
# =====================================================
@app.post("/materias/", response_model=schemas.MateriaOut)
def crear_materia(materia: schemas.MateriaCreate, session=Depends(get_session)):
    return crud.crear_materia(session, materia)

@app.get("/materias/", response_model=list[schemas.MateriaOut])
def listar_materias(session=Depends(get_session)):
    return crud.listar_materias(session)

# =====================================================
# ================= CRUD NOTAS ======================
# =====================================================
@app.post("/notas/", response_model=schemas.NotaOut)
def crear_nota(nota: schemas.NotaCreate, session=Depends(get_session)):
    """
    Crea una nueva nota. Acepta estudianteId/estudiante_id y materiaId/materia_id
    """
    return crud.crear_nota(session, nota)

@app.get("/notas/", response_model=list[schemas.NotaOut])
def listar_notas(estudiante_id: int = None, session=Depends(get_session)):
    return crud.listar_notas(session, estudiante_id)

@app.put("/notas/{nota_id}", response_model=schemas.NotaOut)
def actualizar_nota(nota_id: int, data: schemas.NotaUpdate, session=Depends(get_session)):
    return crud.actualizar_nota(session, nota_id, data)

@app.delete("/notas/{nota_id}")
def eliminar_nota(nota_id: int, session=Depends(get_session)):
    crud.eliminar_nota(session, nota_id)
    return {"detail": "Eliminado"}

# =====================================================
# =============== WEBSOCKET PROGRESO =================
# =====================================================
active_websockets = set()

@app.websocket("/ws/excel-progress")
async def websocket_excel_progress(websocket: WebSocket):
    await websocket.accept()
    active_websockets.add(websocket)
    try:
        while True:
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        active_websockets.remove(websocket)

async def notify_clients(message: dict):
    dead = []
    for ws in active_websockets:
        try:
            await ws.send_json(message)
        except:
            dead.append(ws)
    for ws in dead:
        active_websockets.remove(ws)

# =====================================================
# =============== MÓDULO EXCEL ======================
# =====================================================
@app.post("/upload-excel/")
async def upload_excel(file: UploadFile = File(...)):

    cached_sheets.clear()

    if not file.filename.lower().endswith(".xlsx"):
        raise HTTPException(status_code=400, detail="Solo archivos .xlsx son permitidos")

    try:
        await notify_clients({"status": "processing", "progress": 5, "message": "Leyendo archivo..."})

        contents = await file.read()
        excel_data = pd.read_excel(io.BytesIO(contents), sheet_name=None)

        total_sheets = len(excel_data)
        processed = 0

        preview = []
        duplicates_global = []

        for name, df in excel_data.items():

            processed += 1
            progress = int((processed / total_sheets) * 100)

            await notify_clients({
                "status": "processing",
                "progress": progress,
                "message": f"Procesando hoja {name}..."
            })

            df = df.fillna("")

            headers = df.columns.tolist()
            rows = df.values.tolist()

            duplicates_local = []
            if "email" in [c.lower() for c in df.columns]:
                emails = df["email"].tolist()
                seen = set()
                for idx, email in enumerate(emails):
                    if email in seen:
                        duplicates_local.append(idx)
                    else:
                        seen.add(email)

            duplicates_global.append({
                "sheet": name,
                "rows": duplicates_local
            })

            preview_sheet = {
                "name": name,
                "headers": headers,
                "data": rows
            }

            cached_sheets.append(preview_sheet)
            preview.append(preview_sheet)

        await notify_clients({"status": "done", "progress": 100, "message": "Procesamiento completado"})

        return {
            "message": "Archivo cargado correctamente",
            "sheets": preview,
            "duplicates": duplicates_global
        }

    except Exception as e:
        await notify_clients({"status": "error", "message": str(e)})
        raise HTTPException(status_code=400, detail=f"Error procesando archivo: {str(e)}")

@app.get("/preview-sheets/")
def preview_sheets():
    if not cached_sheets:
        raise HTTPException(status_code=404, detail="No hay datos en vista previa")
    return {"sheets": cached_sheets}

# =====================================================
# ============= ENDPOINTS PARA GRÁFICOS =============
# =====================================================
@app.get("/stats/notas/materia")
def stats_materia(session=Depends(get_session)):
    materias = session.query(models.Materia).all()
    data = {}
    for m in materias:
        notas = session.query(models.Nota.nota).filter(models.Nota.materia_id == m.id).all()
        avg = sum([n[0] for n in notas]) / len(notas) if notas else 0
        data[m.nombre] = avg
    return {"labels": list(data.keys()), "data": list(data.values())}

@app.get("/stats/notas/estudiante")
def stats_estudiante(session=Depends(get_session)):
    estudiantes = session.query(models.Estudiante).all()
    data = {}
    for s in estudiantes:
        notas = session.query(models.Nota.nota).filter(models.Nota.estudiante_id == s.id).all()
        avg = sum([n[0] for n in notas]) / len(notas) if notas else 0
        data[s.nombre] = avg
    return {"labels": list(data.keys()), "data": list(data.values())}

@app.get("/stats/")
def stats_totales(session=Depends(get_session)):
    estudiantes = session.query(models.Estudiante).all()
    estudiantes_labels = []
    estudiantes_data = []

    for s in estudiantes:
        notas = session.query(models.Nota.nota).filter(models.Nota.estudiante_id == s.id).all()
        avg = sum([n[0] for n in notas]) / len(notas) if notas else 0
        estudiantes_labels.append(s.nombre)
        estudiantes_data.append(avg)

    materias = session.query(models.Materia).all()
    materias_labels = []
    materias_data = []

    for m in materias:
        notas = session.query(models.Nota.nota).filter(models.Nota.materia_id == m.id).all()
        avg = sum([n[0] for n in notas]) / len(notas) if notas else 0
        materias_labels.append(m.nombre)
        materias_data.append(avg)

    return {
        "studentsLabels": estudiantes_labels,
        "studentsData": estudiantes_data,
        "gradesLabels": materias_labels,
        "gradesData": materias_data
    }

# =====================================================
# ============ ENDPOINTS ADICIONALES =================
# =====================================================
@app.get("/stats/top-students")
def top_students(limit: int = 10, session=Depends(get_session)):
    q = (
        session.query(
            models.Estudiante.id,
            models.Estudiante.nombre,
            func.avg(models.Nota.nota).label("avg_grade"),
            func.count(models.Nota.id).label("count_notes")
        )
        .join(models.Nota, models.Nota.estudiante_id == models.Estudiante.id)
        .group_by(models.Estudiante.id)
        .order_by(func.avg(models.Nota.nota).desc())
        .limit(limit)
        .all()
    )

    result = [
        {"id": r.id, "nombre": r.nombre, "avg": float(round(r.avg_grade or 0, 2)), "count": int(r.count_notes)}
        for r in q
    ]
    return {"top": result}

@app.get("/alerts/low-grades")
def low_grade_alerts(threshold: float = 3.0, min_notes: int = 1, session=Depends(get_session)):
    q = (
        session.query(
            models.Estudiante.id,
            models.Estudiante.nombre,
            func.avg(models.Nota.nota).label("avg_grade"),
            func.count(models.Nota.id).label("count_notes")
        )
        .join(models.Nota, models.Nota.estudiante_id == models.Estudiante.id)
        .group_by(models.Estudiante.id)
        .having(func.count(models.Nota.id) >= min_notes)
        .having(func.avg(models.Nota.nota) < threshold)
        .order_by(func.avg(models.Nota.nota).asc())
        .all()
    )

    alerts = [
        {"id": r.id, "nombre": r.nombre, "avg": float(round(r.avg_grade or 0, 2)), "count": int(r.count_notes)}
        for r in q
    ]
    return {"alerts": alerts, "threshold": threshold}