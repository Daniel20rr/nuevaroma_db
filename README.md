Proyecto: nuevaroma_db (ZIP generado con Alembic migrations y datos de ejemplo)
Estructura:
- backend/ (FastAPI + Alembic + seed script)
- frontend/ (Angular 15 + Bootstrap)
- docker-compose.yml
- .env (DB credentials)

Instrucciones rápidas:
1. Colocar el proyecto en tu máquina (WSL recomendado).
2. Revisar .env y ajustarlo si deseas.
3. Ejecutar: docker compose up --build
   - El contenedor backend ejecutará: `alembic upgrade head` y luego `python seed.py` antes de arrancar el servidor.
4. Frontend: http://localhost:4200
   Backend API: http://localhost:8000
   API docs: http://localhost:8000/docs

Notas:
- Las migraciones Alembic están ubicadas en backend/alembic. La primera migración 0001_initial crea las tablas básicas.
- seed.py inserta alumnos, materias y notas de ejemplo si la tabla de estudiantes está vacía.
- Si alembic no está en el PATH durante build, el entrypoint ignora errores y continúa; revisa logs del contenedor backend si algo falla.
