from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

import crud, schemas
from database import AsyncSessionLocal

router = APIRouter()


async def get_db() -> AsyncSession:  # type: ignore
    async with AsyncSessionLocal() as session:
        yield session


@router.get("/", response_model=List[schemas.SubjectSimple])
async def get_all_subjects(
    year: Optional[int] = None, db: AsyncSession = Depends(get_db)
):
    return await crud.get_all_subjects(db, year=year)


@router.get("/{subject_id}", response_model=schemas.Subject)
async def get_subject_details(subject_id: int, db: AsyncSession = Depends(get_db)):
    db_subject = await crud.get_subject_details(db, subject_id=subject_id)
    if db_subject is None:
        raise HTTPException(status_code=404, detail="Subject not found")
    return db_subject


@router.post("/", response_model=schemas.SubjectSimple)
async def create_subject(
    subject: schemas.SubjectCreate, db: AsyncSession = Depends(get_db)
):
    return await crud.create_subject(db=db, subject=subject)


@router.post("/with-chapter", response_model=schemas.SubjectSimple)
async def create_subject_with_chapter(
    data: schemas.NewSubjectWithChapter, db: AsyncSession = Depends(get_db)
):
    return await crud.create_subject_with_chapter(db=db, data=data)
