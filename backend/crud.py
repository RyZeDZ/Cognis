from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

import models, schemas
from security import get_password_hash


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
        .options(selectinload(models.Subject.chapters))
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
