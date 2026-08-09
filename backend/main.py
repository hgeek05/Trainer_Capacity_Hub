from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import capacity, users, trainers, ai_router, centers, calendar_router

app = FastAPI(title="Trainer Capacity Hub API")

# Configuration CORS pour le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Branchement des routeurs
app.include_router(users.router)
app.include_router(capacity.router)
app.include_router(trainers.router)
app.include_router(ai_router.router)
app.include_router(centers.router)
app.include_router(calendar_router.router)


@app.get("/")
def read_root():
    return {"status": "API is running", "database": "Connected"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)