# backend/api/endpoints/notifications.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

import crud, schemas, models
from .users import (
    require_auth,
)  # We require a logged-in user for all notification actions
from database import AsyncSessionLocal

router = APIRouter()


async def get_db() -> AsyncSession:  # type: ignore
    async with AsyncSessionLocal() as session:
        yield session


@router.get("/", response_model=schemas.NotificationsResponse)
async def get_my_notifications(
    current_user: models.User = Depends(require_auth),
    db: AsyncSession = Depends(get_db),
):
    """
    Gets all notifications and the unread count for the current user.
    """
    notifications, unread_count = await crud.get_user_notifications(
        db, user_id=current_user.id
    )
    return {"notifications": notifications, "unread_count": unread_count}


@router.post("/mark-all-read", status_code=status.HTTP_204_NO_CONTENT)
async def mark_all_as_read(
    current_user: models.User = Depends(require_auth),
    db: AsyncSession = Depends(get_db),
):
    """
    Marks all of the current user's notifications as read.
    """
    await crud.mark_user_notifications_as_read(db, user_id=current_user.id)
    # A 204 response means "Success, but I have no content to send back to you."
    # This is the standard for actions like this.
    return
