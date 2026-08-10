import os
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers import capacity, users, trainers, ai_router, centers, calendar_router

# Logger setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("trainer_capacity_hub")

app = FastAPI(
    title="Trainer Capacity Hub API",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configuration CORS sécurisée (origines restreintes)
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

# Middleware d'en-têtes de sécurité HTTP (DevSecOps Best Practices)
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    # En-têtes de sécurité HTTP (DevSecOps)
    # Sur /docs, /redoc et /openapi.json, ne pas appliquer de restriction CSP pour laisser Swagger UI s'exécuter
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

@app.on_event("startup")
def startup_db_cleanup():
    try:
        from generate_mock_data import fix_all_user_emails
        fix_all_user_emails()
    except Exception as e:
        logger.warning(f"Startup email cleanup notice: {e}")

@app.get("/")
def read_root():
    return {"status": "API is running", "database": "Connected"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)