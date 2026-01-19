from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

import crud, schemas
from api.endpoints.users import require_admin
from database import AsyncSessionLocal

router = APIRouter()


async def get_db() -> AsyncSession:  # type: ignore
    async with AsyncSessionLocal() as session:
        yield session


@router.get("/{chapter_id}", response_model=schemas.Chapter)
async def get_chapter(chapter_id: int, db: AsyncSession = Depends(get_db)):
    db_chapter = await crud.get_chapter_by_id(db, chapter_id=chapter_id)
    if db_chapter is None:
        raise HTTPException(status_code=404, detail="Chapter not found")
    return db_chapter


@router.put("/{chapter_id}", response_model=schemas.Chapter)
async def update_chapter_endpoint(
    chapter_id: int,
    chapter_update: schemas.ChapterUpdate,
    db: AsyncSession = Depends(get_db),
    admin_user: schemas.User = Depends(require_admin),
):
    """
    Updates a chapter by its ID. Only accessible by admin users.
    """
    updated_chapter = await crud.update_chapter(
        db=db, chapter_id=chapter_id, chapter_update=chapter_update
    )

    if updated_chapter is None:
        raise HTTPException(status_code=404, detail="Chapter not found")

    return updated_chapter


@router.delete("/{chapter_id}", response_model=schemas.Chapter)
async def delete_chapter_endpoint(
    chapter_id: int,
    db: AsyncSession = Depends(get_db),
    admin_user: schemas.User = Depends(require_admin),
):
    """
    Deletes a chapter by its ID. Only accessible by admin users.
    """
    deleted_chapter = await crud.delete_chapter(db=db, chapter_id=chapter_id)

    if deleted_chapter is None:
        raise HTTPException(status_code=404, detail="Chapter not found")

    return deleted_chapter
