from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import models
from database import engine
from api.endpoints import subjects, users, auth, utils

app = FastAPI(title="Cognis API")


async def create_db_and_tables():
    async with engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.create_all)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(subjects.router, prefix="/api/subjects", tags=["Subjects"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(utils.router, prefix="/api/utils", tags=["Utils"])


@app.get("/")
def read_root():
    return {"status": "Cognis API is running"}
