from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
import schemas
import crud
from api.endpoints.users import require_admin
from database import AsyncSessionLocal

router = APIRouter()


async def get_db() -> AsyncSession:  # type: ignore
    async with AsyncSessionLocal() as session:
        yield session


@router.post(
    "/approve-content/{content_type}/{content_id}",
    dependencies=[Depends(require_admin)],
)
async def approve_submitted_content(
    content_type: str, content_id: int, db: AsyncSession = Depends(get_db)
):
    approved_item = await crud.approve_content(
        db, content_type=content_type, content_id=content_id
    )
    if not approved_item:
        raise HTTPException(
            status_code=404, detail="Content not found or type is invalid."
        )
    return {"message": f"{content_type.capitalize()} approved successfully."}


@router.get(
    "/review-item/chapter/{chapter_id}",
    response_model=schemas.Chapter,
    dependencies=[Depends(require_admin)],
)
async def get_review_item_chapter(chapter_id: int, db: AsyncSession = Depends(get_db)):
    """
    Admin-only endpoint to fetch a single chapter, regardless of its published status.
    """
    chapter = await crud.get_chapter_by_id(db, chapter_id=chapter_id)
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found.")
    return chapter


@router.get(
    "/review-item/exam/{exam_id}",
    response_model=schemas.Exam,
    dependencies=[Depends(require_admin)],
)
async def get_review_item_exam(exam_id: int, db: AsyncSession = Depends(get_db)):
    """
    Admin-only endpoint to fetch a single exam, regardless of its published status.
    """
    exam = await crud.get_exam_by_id(db, exam_id=exam_id)
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found.")
    return exam


@router.get(
    "/review-item/resource/{resource_id}",
    response_model=schemas.Resource,
    dependencies=[Depends(require_admin)],
)
async def get_review_item_resource(
    resource_id: int, db: AsyncSession = Depends(get_db)
):
    """
    Admin-only endpoint to fetch a single exam, regardless of its published status.
    """
    resource = await crud.get_resource_by_id(db, resource_id=resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found.")
    return resource


# --- NEW ENDPOINT for rejecting/deleting new content ---
@router.post(
    "/reject-content/{content_type}/{content_id}", dependencies=[Depends(require_admin)]
)
async def reject_submitted_content(
    content_type: str, content_id: int, db: AsyncSession = Depends(get_db)
):
    rejected_item = await crud.reject_new_content_submission(
        db, content_type=content_type, content_id=content_id
    )
    if not rejected_item:
        raise HTTPException(
            status_code=404, detail="Content not found or type is invalid."
        )
    return {"message": f"{content_type.capitalize()} rejected successfully."}


@router.delete(
    "/submission/{content_type}/{content_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_admin)],
)
async def delete_new_content_submission(
    content_type: str, content_id: int, db: AsyncSession = Depends(get_db)
):
    deleted_item = await crud.delete_new_submission(
        db, content_type=content_type, content_id=content_id
    )
    if not deleted_item:
        raise HTTPException(status_code=404, detail="Content submission not found.")
    return
