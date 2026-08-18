import os
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from database import engine, Base
from routers import capacity, users, trainers, ai_router, centers, calendar_router, sessions, auth, profiles

from sqlalchemy import text

Base.metadata.create_all(bind=engine)

# Auto-migration pour les colonnes de sécurité et profil
try:
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token VARCHAR;"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP;"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_code VARCHAR;"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_expires TIMESTAMP;"))
        conn.execute(text("ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone VARCHAR;"))
        conn.execute(text("ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;"))
        conn.commit()
except Exception as e:
    print(f"[DB Migration Note] {e}")

# Logger setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("trainer_capacity_hub")

# Environment setup (desactive la documentation Swagger/ReDoc en production)
ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()
IS_PROD = ENVIRONMENT in ("production", "prod")

app = FastAPI(
    title="Trainer Capacity Hub API",
    docs_url=None if IS_PROD else "/docs",
    redoc_url=None if IS_PROD else "/redoc",
    openapi_url=None if IS_PROD else "/openapi.json",
)

# Configuration CORS sécurisée (
raw_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001",
)
allowed_origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    if not request.url.path.startswith(("/docs", "/redoc", "/openapi.json")):
        response.headers["Content-Security-Policy"] = "default-src 'self'; frame-ancestors 'none';"
    return response

# Handler global pour masquer les erreurs 500 internes et éviter le leak de stack traces
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Internal server error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Une erreur interne est survenue. Veuillez contacter l'administrateur."},
    )

# Branchement des routeurs
app.include_router(users.router)
app.include_router(capacity.router)
app.include_router(trainers.router)
app.include_router(ai_router.router)
app.include_router(centers.router)
app.include_router(calendar_router.router)
app.include_router(sessions.router)
app.include_router(auth.router)
app.include_router(profiles.router)

@app.on_event("startup")
def startup_db_cleanup():
    try:
        from database import SessionLocal
        import models
        db = SessionLocal()
        official_centers = ["Ben Guerir", "Safi", "Jorf Lasfar", "Khouribga"]
        for c_name in official_centers:
            if not db.query(models.Center).filter(models.Center.nom_centre == c_name).first():
                db.add(models.Center(nom_centre=c_name))
        db.commit()
        db.close()
    except Exception as e:
        logger.warning(f"Startup center seeding notice: {e}")
    try:
        from generate_mock_data import seed_initial_passwords
        seed_initial_passwords()
    except Exception as e:
        logger.warning(f"Startup password cleanup notice: {e}")

@app.get("/")
def read_root():
    return {"status": "API is running", "database": "Connected"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)