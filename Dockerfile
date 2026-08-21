FROM python:3.11-slim

WORKDIR /app

# Non-root user setup for container security
RUN addgroup --system appgroup && adduser --system --group appuser

# Copy and install backend dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire repository
COPY . .

# Grant ownership to unprivileged user
RUN chown -R appuser:appgroup /app
USER appuser

# Run database migrations
RUN cd backend && alembic upgrade head

EXPOSE 8000

CMD ["sh", "-c", "cd backend && uvicorn main:app --host 0.0.0.0 --port 8000"]

