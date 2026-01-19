from typing import List, Optional
from fastapi.concurrency import run_in_threadpool
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload, with_loader_criteria
from sqlalchemy import func
from sqlalchemy import update
from sqlalchemy import desc
import models, schemas
from security import get_password_hash
from database import supabase


async def get_user_by_email(db: AsyncSession, email: str) -> models.User | None:
    result = await db.execute(select(models.User).where(models.User.email == email))
    return result.scalar_one_or_none()


async def get_user_by_username(db: AsyncSession, username: str) -> models.User | None:
    result = await db.execute(
        select(models.User).where(models.User.username == username)
    )
    return result.scalar_one_or_none()


async def create_user(db: AsyncSession, user: schemas.UserCreate) -> models.User:
    hashed_password = get_password_hash(user.password)

    db_user = models.User(
        email=user.email,
        username=user.username,
        password=hashed_password,
    )

    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user


async def add_chapter_to_subject(
    db: AsyncSession, chapter: schemas.ChapterCreate, subject_id: int
) -> models.Chapter:
    db_chapter = models.Chapter(
        title=chapter.title,
        content=chapter.content,
        subject_id=subject_id,
    )

    db.add(db_chapter)
    await db.commit()
    await db.refresh(db_chapter)
    return db_chapter


async def get_user_by_username(db: AsyncSession, username: str) -> models.User | None:
    result = await db.execute(
        select(models.User).where(models.User.username == username)
    )
    return result.scalar_one_or_none()


async def get_all_subjects(
    db: AsyncSession, year: Optional[int] = None
) -> List[models.Subject]:
    query = select(models.Subject).order_by(models.Subject.name)
    if year is not None:
        query = query.where(models.Subject.year == year)
    result = await db.execute(query)
    return result.scalars().all()


async def get_subject_details(
    db: AsyncSession, subject_id: int
) -> models.Subject | None:
    query = (
        select(models.Subject)
        .where(models.Subject.id == subject_id)
        .options(
            selectinload(models.Subject.exams).selectinload(models.Exam.user),
            selectinload(models.Subject.chapters),
            selectinload(models.Subject.resources).selectinload(models.Resource.user),
            with_loader_criteria(
                models.Exam,
                lambda cls: cls.status == models.RequestStatus.approved,
                include_aliases=True,
            ),
            with_loader_criteria(
                models.Chapter,
                lambda cls: cls.status == models.RequestStatus.approved,
                include_aliases=True,
            ),
            with_loader_criteria(
                models.Resource,
                lambda cls: cls.status == models.RequestStatus.approved,
                include_aliases=True,
            ),
        )
    )
    result = await db.execute(query)
    return result.scalar_one_or_none()


async def create_subject(
    db: AsyncSession, subject: schemas.SubjectCreate
) -> models.Subject:
    db_subject = models.Subject(**subject.model_dump())
    db.add(db_subject)
    await db.commit()
    await db.refresh(db_subject)
    return db_subject


async def create_subject_with_chapter(
    db: AsyncSession, data: schemas.NewSubjectWithChapter
) -> models.Subject:
    async with db.begin():
        new_subject = models.Subject(
            name=data.subject_name,
            year=data.subject_year,
            specialization=data.subject_specialization,
        )
        db.add(new_subject)
        await db.flush()
        new_chapter = models.Chapter(
            title=data.chapter_title,
            content=data.chapter_content,
            subject_id=new_subject.id,
        )
        db.add(new_chapter)
        await db.refresh(new_subject)
        return new_subject


async def get_all_subjects_with_chapters(db: AsyncSession):
    query = (
        select(models.Subject)
        .options(
            selectinload(models.Subject.chapters).selectinload(models.Chapter.subject),
            selectinload(models.Subject.exams).selectinload(models.Exam.user),
            selectinload(models.Subject.resources).selectinload(models.Resource.user),
        )
        .order_by(models.Subject.name)
    )
    result = await db.execute(query)
    return result.scalars().unique().all()


async def get_chapter_by_id(db: AsyncSession, chapter_id: int) -> models.Chapter | None:
    return await db.get(models.Chapter, chapter_id)


async def update_chapter(
    db: AsyncSession, chapter_id: int, chapter_update: schemas.ChapterUpdate
) -> models.Chapter | None:
    """
    Updates a chapter in the database.
    """
    db_chapter = await db.get(models.Chapter, chapter_id)
    if db_chapter:
        update_data = chapter_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_chapter, key, value)

        await db.commit()
        await db.refresh(db_chapter)
        return db_chapter

    return None


async def delete_chapter(db: AsyncSession, chapter_id: int) -> models.Chapter | None:
    """
    Deletes a chapter from the database by its ID.
    Returns the deleted chapter object if found, otherwise None.
    """
    chapter_to_delete = await db.get(models.Chapter, chapter_id)

    if chapter_to_delete:
        await db.delete(chapter_to_delete)
        await db.commit()
        return chapter_to_delete

    return None


async def create_modification_request(
    db: AsyncSession,
    request_data: schemas.ModificationRequestCreate,
    user_id: int,
    chapter_id: int,
) -> models.ModificationRequest:
    """
    Creates a new modification request in the database.
    """
    db_request = models.ModificationRequest(
        proposed_title=request_data.proposed_title,
        proposed_content=request_data.proposed_content,
        user_id=user_id,
        chapter_id=chapter_id,
    )
    db.add(db_request)
    await db.commit()

    # --- THIS IS THE FIX ---
    # After committing, the db_request object is 'expired'. We need to refresh it
    # to get the latest data from the DB, and we can tell it to load relationships.
    # We query for the object again and use selectinload.
    query = (
        select(models.ModificationRequest)
        .where(models.ModificationRequest.id == db_request.id)
        .options(
            selectinload(models.ModificationRequest.user),
            selectinload(models.ModificationRequest.chapter),
        )
    )
    result = await db.execute(query)
    refreshed_request = result.scalar_one()

    return refreshed_request


async def get_pending_modification_requests(
    db: AsyncSession,
) -> List[models.ModificationRequest]:
    """
    Fetches all modification requests with a 'pending' status.
    Eagerly loads the related user and chapter info.
    """
    query = (
        select(models.ModificationRequest)
        .where(models.ModificationRequest.status == models.RequestStatus.pending)
        .options(
            selectinload(models.ModificationRequest.user),
            selectinload(models.ModificationRequest.chapter).selectinload(
                models.Chapter.subject
            ),
        )
        .order_by(models.ModificationRequest.created_at.asc())
    )
    result = await db.execute(query)
    return result.scalars().all()


async def get_full_modification_request(
    db: AsyncSession, request_id: int
) -> models.ModificationRequest | None:
    """
    Fetches a single modification request by its ID, eagerly loading all
    necessary related data for the diff view.
    """
    query = (
        select(models.ModificationRequest)
        .where(models.ModificationRequest.id == request_id)
        .options(
            selectinload(models.ModificationRequest.user),
            selectinload(models.ModificationRequest.chapter),  # This is the key
        )
    )
    result = await db.execute(query)
    return result.scalar_one_or_none()


async def approve_modification_request(
    db: AsyncSession, request_id: int
) -> models.ModificationRequest | None:
    """
    Approves a modification request and updates the original chapter content.
    """
    async with db.begin():
        # --- THIS IS THE FIX ---
        # We must load BOTH the 'chapter' and the 'user' to satisfy the response model.
        query = (
            select(models.ModificationRequest)
            .where(models.ModificationRequest.id == request_id)
            .options(
                selectinload(models.ModificationRequest.chapter),
                selectinload(models.ModificationRequest.user),  # <-- ADD THIS LINE
            )
        )
        result = await db.execute(query)
        mod_request = result.scalar_one_or_none()

        if not mod_request or not mod_request.chapter:
            return None

        # ... (the rest of the update logic is correct)
        mod_request.chapter.title = mod_request.proposed_title
        mod_request.chapter.content = mod_request.proposed_content
        mod_request.status = models.RequestStatus.approved
        mod_request.reviewed_at = func.now()
        chapter_link = f"/subjects/{mod_request.chapter.subject_id}/chapters/{mod_request.chapter.id}"
        notification_message = (
            f"Your suggestion for '{mod_request.chapter.title}' has been approved!"
        )
        notification = models.Notification(
            user_id=mod_request.user_id, message=notification_message, link=chapter_link
        )
        db.add(notification)

    result = await db.execute(query)
    updated_request = result.scalar_one_or_none()
    return updated_request


async def reject_modification_request(
    db: AsyncSession, request_id: int, comment: str
) -> models.ModificationRequest | None:
    """
    Rejects a request and creates a notification in a single transaction.
    """
    async with db.begin():
        query = (
            select(models.ModificationRequest)
            .where(models.ModificationRequest.id == request_id)
            .options(
                selectinload(models.ModificationRequest.chapter),
                selectinload(models.ModificationRequest.user),
            )
        )
        result = await db.execute(query)
        mod_request = result.scalar_one_or_none()

        if not mod_request:
            return None

        mod_request.status = models.RequestStatus.rejected
        mod_request.reviewer_comment = comment
        mod_request.reviewed_at = func.now()

        chapter_link = f"/subjects/{mod_request.chapter.subject_id}/chapters/{mod_request.chapter.id}"
        notification_message = (
            f"Your suggestion for '{mod_request.chapter.title}' was rejected."
        )

        notification = models.Notification(
            user_id=mod_request.user_id, message=notification_message, link=chapter_link
        )
        db.add(notification)

    result = await db.execute(query)
    updated_request = result.scalar_one_or_none()

    return updated_request


async def get_user_modification_requests(
    db: AsyncSession, user_id: int
) -> List[models.ModificationRequest]:
    """
    Fetches all modification requests submitted by a specific user.
    """
    query = (
        select(models.ModificationRequest)
        .where(models.ModificationRequest.user_id == user_id)
        .options(
            selectinload(models.ModificationRequest.chapter)
        )  # Eager load the chapter
        .order_by(
            models.ModificationRequest.created_at.desc()
        )  # Show the most recent first
    )
    result = await db.execute(query)
    return result.scalars().all()


async def update_user_profile(
    db: AsyncSession, user_id: int, user_update: schemas.UserUpdate
) -> models.User:
    """
    Updates a user's information, handling old profile picture deletion.
    """
    user = await get_user_by_id(db, user_id)
    # --- NEW, SIMPLIFIED DELETION LOGIC ---
    # If a new URL is being provided AND an old URL already exists...
    if user_update.profile_image_url and user.profile_image_url:
        try:
            # Extract the storage path from the old URL
            # The path is everything after '/cognis-images/'
            old_path = user.profile_image_url.split("/cognis-images/")[-1]
            print(f"Attempting to delete old PFP at path: {old_path}")
            supabase.storage.from_("cognis-images").remove([old_path])
        except Exception as e:
            print(f"Error deleting old profile picture: {e}")

    # This part remains the same
    update_data = user_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)

    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def get_user_by_id(db: AsyncSession, user_id: int) -> models.User | None:
    """
    Fetches a user from the database by their ID.
    """
    return await db.get(models.User, user_id)


async def get_user_by_google_id(db: AsyncSession, google_id: str) -> models.User | None:
    result = await db.execute(
        select(models.User).where(models.User.google_id == google_id)
    )
    return result.scalar_one_or_none()


async def create_notification(
    db: AsyncSession, user_id: int, message: str, link: str = None
) -> models.Notification:
    """
    Creates a new notification for a user.
    """
    db_notification = models.Notification(user_id=user_id, message=message, link=link)
    db.add(db_notification)
    await db.commit()
    await db.refresh(db_notification)
    return db_notification


async def get_user_notifications(
    db: AsyncSession, user_id: int
) -> tuple[models.Notification, int]:
    """
    Fetches all notifications for a user and the count of unread notifications.
    """
    # Query for all notifications for the user
    query = (
        select(models.Notification)
        .where(models.Notification.user_id == user_id)
        .order_by(models.Notification.created_at.desc())
    )
    result = await db.execute(query)
    notifications = result.scalars().all()

    # Query for the count of unread notifications
    unread_count_query = (
        select(func.count(models.Notification.id))
        .where(models.Notification.user_id == user_id)
        .where(models.Notification.is_read == False)
    )
    unread_count_result = await db.execute(unread_count_query)
    unread_count = unread_count_result.scalar_one()

    return notifications, unread_count


async def mark_user_notifications_as_read(db: AsyncSession, user_id: int) -> int:
    """
    Marks all of a user's unread notifications as read.
    Returns the number of notifications that were updated.
    """
    query = (
        update(models.Notification)
        .where(models.Notification.user_id == user_id)
        .where(models.Notification.is_read == False)
        .values(is_read=True)
    )
    result = await db.execute(query)
    await db.commit()

    # result.rowcount gives us the number of rows that were affected by the update
    return result.rowcount


async def increment_subject_visit_count(db: AsyncSession, subject_id: int):
    """
    Finds a subject by ID and increments its visit_count by 1.
    """
    subject = await db.get(models.Subject, subject_id)
    if subject:
        subject.visit_count += 1
        await db.commit()
    return


async def get_top_subjects(db: AsyncSession, limit: int = 6) -> List[models.Subject]:
    """
    Fetches the top N subjects ordered by visit_count.
    """
    query = (
        select(models.Subject).order_by(desc(models.Subject.visit_count)).limit(limit)
    )
    result = await db.execute(query)
    return result.scalars().all()


async def get_user_by_reset_token(db: AsyncSession, token: str) -> models.User | None:
    result = await db.execute(
        select(models.User).where(models.User.password_reset_token == token)
    )
    return result.scalar_one_or_none()


async def create_uploaded_image(
    db: AsyncSession,
    user_id: int,
    public_url: str,
    storage_path: str,
    chapter_id: Optional[int] = None,
) -> models.UploadedImage:
    db_image = models.UploadedImage(
        user_id=user_id,
        public_url=public_url,
        storage_path=storage_path,
        chapter_id=chapter_id,
    )
    db.add(db_image)
    await db.commit()
    await db.refresh(db_image)
    return db_image


async def delete_chapter(db: AsyncSession, chapter_id: int) -> models.Chapter | None:
    """
    Deletes a chapter from the database by its ID.
    Also finds all associated images, deletes them from Supabase storage,
    and then deletes their tracking records.
    """
    # Use a transaction to ensure all or nothing is deleted
    async with db.begin():
        # 1. Fetch the chapter and eagerly load its associated images
        query = (
            select(models.Chapter)
            .where(models.Chapter.id == chapter_id)
            .options(selectinload(models.Chapter.uploaded_images))
        )
        result = await db.execute(query)
        chapter_to_delete = result.scalar_one_or_none()

        if not chapter_to_delete:
            return None

        # 2. If there are images, prepare to delete them from Supabase
        if chapter_to_delete.uploaded_images:
            # Create a list of the storage paths to delete
            paths_to_delete = [
                image.storage_path for image in chapter_to_delete.uploaded_images
            ]

            print(f"Found {len(paths_to_delete)} images to delete from storage.")

            try:
                # 3. Use the Supabase client to remove the files
                # We need to run this synchronous call in a threadpool
                def remove_files_sync():
                    supabase.storage.from_("cognis-images").remove(paths_to_delete)

                await run_in_threadpool(remove_files_sync)

                print("Successfully deleted images from Supabase.")
            except Exception as e:
                # If Supabase fails, we should probably stop the whole process
                # to avoid leaving orphaned files. The transaction will automatically roll back.
                print(f"Error deleting files from Supabase: {e}")
                raise e  # Raising the error will cause the transaction to roll back

        # 4. Delete the chapter from our database.
        # The 'cascade="all, delete-orphan"' on the relationships in models.py
        # will automatically delete the rows from `uploaded_images` and
        # `modification_requests` tables that were linked to this chapter.
        await db.delete(chapter_to_delete)

    # The transaction commits here if everything was successful
    return chapter_to_delete


async def create_exam_submission(
    db: AsyncSession, exam_data: schemas.ExamCreate, subject_id: int, user_id: int
) -> models.Exam:
    db_exam = models.Exam(
        **exam_data.model_dump(),
        subject_id=subject_id,
        user_id=user_id,
        status=models.RequestStatus.pending,
    )
    db.add(db_exam)
    await db.commit()
    query = (
        select(models.Exam)
        .where(models.Exam.id == db_exam.id)
        .options(selectinload(models.Exam.user))
    )
    result = await db.execute(query)
    return result.scalar_one()


async def create_resource_submission(
    db: AsyncSession,
    resource_data: schemas.ResourceCreate,
    subject_id: int,
    user_id: int,
) -> models.Resource:
    db_resource = models.Resource(
        **resource_data.model_dump(),
        subject_id=subject_id,
        user_id=user_id,
        status=models.RequestStatus.pending,
    )
    db.add(db_resource)
    await db.commit()
    query = (
        select(models.Resource)
        .where(models.Resource.id == db_resource.id)
        .options(selectinload(models.Resource.user))
    )
    result = await db.execute(query)
    return result.scalar_one()


async def create_chapter_submission(
    db: AsyncSession, chapter_data: schemas.ChapterCreate, subject_id: int, user_id: int
) -> models.Chapter:
    """
    Creates a new chapter submitted by a user, with is_published set to False.
    """
    # Note: 'user_id' is not a column on the Chapter model in our current design,
    # so we don't pass it. The approval would be tracked differently.
    # Let's add it for consistency.
    # You will need to run an Alembic migration to add 'user_id' to the 'chapters' table.
    print("chapter_data:", chapter_data.model_dump())
    print("user_id arg:", user_id)
    db_chapter = models.Chapter(
        **chapter_data.model_dump(),
        subject_id=subject_id,
        user_id=user_id,  # Add this
        status=models.RequestStatus.pending,
    )
    db.add(db_chapter)
    await db.commit()
    await db.refresh(db_chapter)
    return db_chapter


# --- NEW GENERIC APPROVAL FUNCTION ---
# This function will approve any type of content
async def approve_content(db: AsyncSession, content_type: str, content_id: int):
    model_map = {
        "chapter": models.Chapter,
        "exam": models.Exam,
        "resource": models.Resource,
    }
    model = model_map.get(content_type)
    if not model:
        return None

    content_item = await db.get(model, content_id)
    if content_item:
        content_item.status = models.RequestStatus.approved
        await db.commit()
        await db.refresh(content_item)
    return content_item


async def get_unpublished_chapters(db: AsyncSession) -> List[models.Chapter]:
    """
    Fetches all chapters with is_published = False.
    Eagerly loads the related user and subject info needed for the review queue.
    """
    query = (
        select(models.Chapter)
        .where(models.Chapter.status == models.RequestStatus.pending)
        .options(
            selectinload(models.Chapter.user), selectinload(models.Chapter.subject)
        )
        .order_by(models.Chapter.created_at.asc())
    )
    result = await db.execute(query)
    return result.scalars().all()


async def get_unpublished_exams(db: AsyncSession) -> List[models.Exam]:
    """
    Fetches all exams with is_published = False.
    Eagerly loads the related user and subject info.
    """

    query = (
        select(models.Exam)
        .where(models.Exam.status == models.RequestStatus.pending)
        .options(selectinload(models.Exam.user), selectinload(models.Exam.subject))
        .order_by(models.Exam.created_at.asc())
    )
    result = await db.execute(query)
    return result.scalars().all()


async def get_unpublished_resources(db: AsyncSession) -> List[models.Resource]:
    """
    Fetches all resources with is_published = False.
    Eagerly loads the related user and subject info.
    """
    query = (
        select(models.Resource)
        .where(models.Resource.status == models.RequestStatus.pending)
        .options(
            selectinload(models.Resource.user), selectinload(models.Resource.subject)
        )
        .order_by(models.Resource.created_at.asc())
    )
    result = await db.execute(query)
    return result.scalars().all()


async def get_user_unpublished_chapters(
    db: AsyncSession, user_id: int
) -> List[models.Chapter]:
    query = (
        select(models.Chapter)
        .where(models.Chapter.status == models.RequestStatus.pending)
        .where(models.Chapter.user_id == user_id)
        .options(selectinload(models.Chapter.subject))
    )
    result = await db.execute(query)
    return result.scalars().all()


async def get_user_unpublished_exams(
    db: AsyncSession, user_id: int
) -> List[models.Exam]:
    query = (
        select(models.Exam)
        .where(models.Exam.status == models.RequestStatus.pending)
        .where(models.Exam.user_id == user_id)
        .options(selectinload(models.Exam.subject))
    )
    result = await db.execute(query)
    return result.scalars().all()


async def get_user_unpublished_resources(
    db: AsyncSession, user_id: int
) -> List[models.Resource]:
    query = (
        select(models.Resource)
        .where(models.Resource.status == models.RequestStatus.pending)
        .where(models.Resource.user_id == user_id)
        .options(selectinload(models.Resource.subject))
    )
    result = await db.execute(query)
    return result.scalars().all()


async def get_exam_by_id(db: AsyncSession, exam_id: int) -> models.Exam | None:
    """
    Fetches a single exam from the database by its ID.
    Eagerly loads the user for the review page.
    """
    query = (
        select(models.Exam)
        .where(models.Exam.id == exam_id)
        .options(selectinload(models.Exam.user))
    )
    result = await db.execute(query)
    return result.scalar_one_or_none()


async def get_resource_by_id(
    db: AsyncSession, resource_id: int
) -> models.Resource | None:
    """
    Fetches a single resource from the database by its ID.
    Eagerly loads the user for the review page.
    """
    query = (
        select(models.Resource)
        .where(models.Resource.id == resource_id)
        .options(selectinload(models.Resource.user))
    )
    result = await db.execute(query)
    return result.scalar_one_or_none()


async def reject_new_content_submission(
    db: AsyncSession, content_type: str, content_id: int
):
    model_map = {
        "chapter": models.Chapter,
        "exam": models.Exam,
        "resource": models.Resource,
    }
    model = model_map.get(content_type)
    if not model:
        return None
    content_item = await db.get(model, content_id)
    if content_item:
        content_item.status = models.RequestStatus.rejected  # SET STATUS to rejected
        await db.commit()
        await db.refresh(content_item)
    return content_item


async def delete_new_submission(db: AsyncSession, content_type: str, content_id: int):
    # This is the same logic as our old 'reject_content' function
    model_map = {
        "chapter": models.Chapter,
        "exam": models.Exam,
        "resource": models.Resource,
    }
    model = model_map.get(content_type)
    if not model:
        return None
    content_item = await db.get(model, content_id)
    if content_item:
        await db.delete(content_item)
        await db.commit()
        return content_item
    return None


async def get_all_user_chapters(db: AsyncSession, user_id: int) -> List[models.Chapter]:
    """Fetches all chapters created by a specific user."""
    query = (
        select(models.Chapter)
        .where(models.Chapter.user_id == user_id)
        .order_by(models.Chapter.created_at.desc())
    )
    result = await db.execute(query)
    return result.scalars().all()


async def get_all_user_exams(db: AsyncSession, user_id: int) -> List[models.Exam]:
    """Fetches all exams submitted by a specific user."""
    query = (
        select(models.Exam)
        .where(models.Exam.user_id == user_id)
        .order_by(models.Exam.created_at.desc())
    )
    result = await db.execute(query)
    return result.scalars().all()


async def get_all_user_resources(
    db: AsyncSession, user_id: int
) -> List[models.Resource]:
    """Fetches all resources submitted by a specific user."""
    query = (
        select(models.Resource)
        .where(models.Resource.user_id == user_id)
        .order_by(models.Resource.created_at.desc())
    )
    result = await db.execute(query)
    return result.scalars().all()
