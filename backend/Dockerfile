FROM python:3.11-slim

WORKDIR /app

# Non-root user setup for container security
RUN addgroup --system appgroup && adduser --system --group appuser

COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Grant ownership to unprivileged user
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]