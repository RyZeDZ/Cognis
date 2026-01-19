from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

import crud, schemas
from database import AsyncSessionLocal
from api.endpoints.users import require_admin

router = APIRouter()


async def get_db() -> AsyncSession:  # type: ignore
    async with AsyncSessionLocal() as session:
        yield session


@router.get("/", response_model=List[schemas.SubjectSimple])
async def get_all_subjects(
    year: Optional[int] = None, db: AsyncSession = Depends(get_db)
):
    return await crud.get_all_subjects(db, year=year)


@router.get(
    "/all-with-content",
    response_model=List[schemas.Subject],
    dependencies=[Depends(require_admin)],
)
async def get_all_subjects_with_full_content(db: AsyncSession = Depends(get_db)):
    """
    Admin-only endpoint to get all subjects including their chapters.
    """
    return await crud.get_all_subjects_with_chapters(db)


@router.get("/top", response_model=List[schemas.SubjectSimple])
async def get_top_subjects_endpoint(db: AsyncSession = Depends(get_db)):
    """
    Gets the top 6 most visited subjects for the homepage.
    """
    return await crud.get_top_subjects(db, limit=8)


@router.post(
    "/", response_model=schemas.SubjectSimple, dependencies=[Depends(require_admin)]
)
async def create_subject(
    subject: schemas.SubjectCreate, db: AsyncSession = Depends(get_db)
):
    return await crud.create_subject(db=db, subject=subject)


@router.post(
    "/with-chapter",
    response_model=schemas.SubjectSimple,
    dependencies=[Depends(require_admin)],
)
async def create_subject_with_chapter(
    data: schemas.NewSubjectWithChapter, db: AsyncSession = Depends(get_db)
):
    return await crud.create_subject_with_chapter(db=db, data=data)


@router.get("/{subject_id}", response_model=schemas.Subject)
async def get_subject_details(subject_id: int, db: AsyncSession = Depends(get_db)):
    db_subject = await crud.get_subject_details(db, subject_id=subject_id)
    if db_subject is None:
        raise HTTPException(status_code=404, detail="Subject not found")
    return db_subject


@router.post(
    "/{subject_id}/chapters/",
    response_model=schemas.Chapter,
    dependencies=[Depends(require_admin)],
)
async def create_chapter_for_subject(
    subject_id: int,
    chapter: schemas.ChapterCreate,
    db: AsyncSession = Depends(get_db),
):
    subject = await crud.get_subject_details(db, subject_id=subject_id)
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    return await crud.add_chapter_to_subject(
        db=db, chapter=chapter, subject_id=subject_id
    )
