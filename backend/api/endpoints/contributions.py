from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

import crud, schemas, models
from .users import (
    require_auth,
    require_admin,
)  # Use 'require_auth' because ANY logged-in user can contribute
from database import AsyncSessionLocal

router = APIRouter()


async def get_db() -> AsyncSession:  # type: ignore
    async with AsyncSessionLocal() as session:
        yield session


@router.post(
    "/chapters/{chapter_id}/suggest-edit", response_model=schemas.ModificationRequest
)
async def suggest_edit_for_chapter(
    chapter_id: int,
    request_data: schemas.ModificationRequestCreate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_auth),  # Get the logged-in user
):
    """
    Allows an authenticated user to suggest an edit for a chapter.
    """
    # First, verify that the chapter they are trying to edit actually exists
    chapter = await crud.get_chapter_by_id(db, chapter_id=chapter_id)
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")

    # Create the modification request in the database
    mod_request = await crud.create_modification_request(
        db=db, request_data=request_data, user_id=current_user.id, chapter_id=chapter_id
    )

    return mod_request


@router.post("/subjects/{subject_id}/suggest-chapter", response_model=schemas.Chapter)
async def suggest_new_chapter(
    subject_id: int,
    chapter_data: schemas.ChapterCreate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_auth),
):
    """
    Allows a user to submit a new chapter for an existing subject.
    It is created as unpublished by default, pending admin review.
    """
    # Verify the subject exists
    subject = await crud.get_subject_details(db, subject_id=subject_id)
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    return await crud.create_chapter_submission(
        db, chapter_data=chapter_data, subject_id=subject_id, user_id=current_user.id
    )


@router.post("/subjects/{subject_id}/suggest-exam", response_model=schemas.Exam)
async def suggest_new_exam(
    subject_id: int,
    exam_data: schemas.ExamCreate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_auth),
):
    """
    Allows a user to submit a new exam PDF for an existing subject.
    It is created as unpublished by default, pending admin review.
    """
    # Verify the subject exists
    subject = await crud.get_subject_details(db, subject_id=subject_id)
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    return await crud.create_exam_submission(
        db, exam_data=exam_data, subject_id=subject_id, user_id=current_user.id
    )


@router.post("/subjects/{subject_id}/suggest-resource", response_model=schemas.Resource)
async def suggest_new_resource(
    subject_id: int,
    resource_data: schemas.ResourceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_auth),
):
    """
    Allows a user to submit a new resource link for an existing subject.
    It is created as unpublished by default, pending admin review.
    """
    # Verify the subject exists
    subject = await crud.get_subject_details(db, subject_id=subject_id)
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    return await crud.create_resource_submission(
        db, resource_data=resource_data, subject_id=subject_id, user_id=current_user.id
    )


@router.get(
    "/review-queue",
    response_model=schemas.ReviewQueueResponse,
    dependencies=[Depends(require_admin)],
)
async def get_full_review_queue(db: AsyncSession = Depends(get_db)):
    """
    Gets a unified list of all pending items (edits and new content) for admin review.
    """
    # 1. Fetch all different types of pending items
    pending_edits = await crud.get_pending_modification_requests(db)
    new_chapters = await crud.get_unpublished_chapters(db)
    new_exams = await crud.get_unpublished_exams(db)
    new_resources = await crud.get_unpublished_resources(db)

    queue_items = []

    # 2. Convert each item into the unified PendingItem schema
    for edit in pending_edits:
        if edit.chapter and edit.chapter.subject:  # Safety check
            queue_items.append(
                schemas.PendingItem(
                    item_type="edit",
                    item_id=edit.id,
                    title=edit.proposed_title,
                    subject_name=edit.chapter.subject.name,
                    user=edit.user,
                    created_at=edit.created_at,
                )
            )

    for chapter in new_chapters:
        if chapter.subject and chapter.user:
            queue_items.append(
                schemas.PendingItem(
                    item_type="new_chapter",
                    item_id=chapter.id,
                    title=chapter.title,
                    subject_name=chapter.subject.name,
                    user=chapter.user,
                    created_at=chapter.created_at,
                )
            )

    for exam in new_exams:
        if exam.subject and exam.user:
            queue_items.append(
                schemas.PendingItem(
                    item_type="new_exam",
                    item_id=exam.id,
                    title=exam.title,
                    subject_name=exam.subject.name,
                    user=exam.user,
                    created_at=exam.created_at,
                )
            )

    for resource in new_resources:
        if resource.subject and resource.user:
            queue_items.append(
                schemas.PendingItem(
                    item_type="new_resource",
                    item_id=resource.id,
                    title=resource.title,
                    subject_name=resource.subject.name,
                    user=resource.user,
                    created_at=resource.created_at,
                )
            )

    # 3. Sort the combined list by creation date, most recent first
    queue_items.sort(key=lambda item: item.created_at, reverse=True)

    return {"items": queue_items}


@router.get("/my/{request_id}", response_model=schemas.ModificationRequest)
async def get_my_single_request(
    request_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_auth),
):
    """
    Gets the full details of a single modification request made by the current user.
    """
    db_request = await crud.get_full_modification_request(db, request_id=request_id)

    # --- SECURITY CHECK ---
    # Ensure the request exists and that the user asking for it is the one who created it.
    if not db_request or db_request.user_id != current_user.id:
        raise HTTPException(
            status_code=404,
            detail="Request not found or you do not have permission to view it.",
        )

    return db_request


@router.post(
    "/{request_id}/approve",
    response_model=schemas.ModificationRequest,
    dependencies=[Depends(require_admin)],
)
async def approve_request(request_id: int, db: AsyncSession = Depends(get_db)):
    """
    Approves a modification request.
    """
    approved_request = await crud.approve_modification_request(
        db, request_id=request_id
    )
    if not approved_request:
        raise HTTPException(
            status_code=404, detail="Request not found or already reviewed."
        )
    return approved_request


@router.post(
    "/{request_id}/reject",
    response_model=schemas.ModificationRequest,
    dependencies=[Depends(require_admin)],
)
async def reject_request(
    request_id: int,
    rejection: schemas.RejectionRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Rejects a modification request with a comment.
    """
    rejected_request = await crud.reject_modification_request(
        db, request_id=request_id, comment=rejection.comment
    )
    if not rejected_request:
        raise HTTPException(
            status_code=404, detail="Request not found or already reviewed."
        )
    return rejected_request


@router.get(
    "/{request_id}",
    response_model=schemas.ModificationRequest,
    dependencies=[Depends(require_admin)],
)
async def get_single_request(request_id: int, db: AsyncSession = Depends(get_db)):
    """
    Gets the full details of a single modification request.
    """
    db_request = await crud.get_full_modification_request(db, request_id=request_id)
    if db_request is None:
        raise HTTPException(status_code=404, detail="Request not found")
    return db_request


@router.get("/my/chapter/{chapter_id}", response_model=schemas.Chapter)
async def get_my_unpublished_chapter(
    chapter_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_auth),
):
    chapter = await crud.get_chapter_by_id(db, chapter_id=chapter_id)
    if not chapter or chapter.user_id != current_user.id:
        raise HTTPException(
            status_code=404, detail="Chapter not found or you don't have permission."
        )
    return chapter


@router.get(
    "/my/exam/{exam_id}",
    response_model=schemas.Exam,
)
async def get_my_unpublished_exam(
    exam_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_auth),
):
    exam = await crud.get_exam_by_id(db, exam_id=exam_id)
    if not exam or exam.user_id != current_user.id:
        raise HTTPException(
            status_code=404, detail="Exam not found or you don't have permission."
        )
    return exam


@router.get(
    "/my/resource/{resource_id}",
    response_model=schemas.Resource,
)
async def get_my_unpublished_resource(
    resource_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(require_auth),
):
    resource = await crud.get_resource_by_id(db, resource_id=resource_id)
    if not resource or resource.user_id != current_user.id:
        raise HTTPException(
            status_code=404, detail="Resource not found or you don't have permission."
        )
    return resource
