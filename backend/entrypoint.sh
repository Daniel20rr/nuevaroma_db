#!/bin/sh
set -e
# Run alembic migrations then seed data, then start uvicorn
alembic upgrade head || true
python seed.py || true
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
