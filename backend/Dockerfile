FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
COPY . .
RUN chmod +x /app/entrypoint.sh
EXPOSE 8000
HEALTHCHECK --interval=10s --timeout=5s --retries=5 CMD curl -f http://localhost:8000/health || exit 1
ENTRYPOINT ["/app/entrypoint.sh"]
