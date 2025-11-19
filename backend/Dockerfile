# Imagen base de Python
FROM python:3.11-slim

# Directorio de trabajo
WORKDIR /app

# Copiar e instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Instalar herramientas necesarias
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl default-mysql-client && \
    rm -rf /var/lib/apt/lists/*

# Copiar el código del proyecto
COPY . .

# Exponer puerto del backend
EXPOSE 8000

# Healthcheck del servicio
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD curl -f http://localhost:8000/health || exit 1

# Ejecutar FastAPI sin script adicional
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
