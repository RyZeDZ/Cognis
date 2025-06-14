from typing import List

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

import models, schemas
from database import engine, AsyncSessionLocal


async def create_db_and_tables():
    async with engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.create_all)


app = FastAPI()


@app.on_event("startup")
async def on_startup():
    await create_db_and_tables()


origins = [
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


@app.get("/api/subjects", response_model=List[schemas.SubjectSimple])
async def get_all_subjects(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Subject))
    subjects = result.scalars().all()
    return subjects


@app.get("/api/subjects/{subject_id}", response_model=schemas.Subject)
async def get_subject_details(subject_id: int, db: AsyncSession = Depends(get_db)):
    query = (
        select(models.Subject)
        .where(models.Subject.id == subject_id)
        .options(selectinload(models.Subject.chapters))
    )

    result = await db.execute(query)
    subject = result.scalar_one_or_none()

    if subject is None:
        raise HTTPException(status_code=404, detail="Subject not found")

    return subject
