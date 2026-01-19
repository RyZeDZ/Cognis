from typing import List
from jose import JWTError, jwt
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

import crud, schemas, models, security
from security import settings, oauth2_scheme, verify_password, create_access_token
from database import AsyncSessionLocal

router = APIRouter()


async def get_db() -> AsyncSession:  # type: ignore
    async with AsyncSessionLocal() as session:
        yield session


async def get_current_user(
    token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token,
            security.settings.SECRET_KEY,
            algorithms=[security.settings.ALGORITHM],
        )
        # We now expect the 'sub' to be the user's ID
        user_id_str: str = payload.get("sub")
        if user_id_str is None:
            raise credentials_exception
        user_id = int(user_id_str)
    except (
        JWTError,
        ValidationError,
        ValueError,
    ) as e:  # Added ValueError for the int conversion
        raise credentials_exception

    # Use the new CRUD function
    user = await crud.get_user_by_id(db, user_id=user_id)
    if user is None:
        raise credentials_exception

    # We must return the model here for require_admin/require_auth to work
    return user


async def require_auth(current_user: schemas.User = Depends(get_current_user)):
    return current_user


async def require_admin(current_user: schemas.User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to perform this action.",
        )
    return current_user


@router.post("/", response_model=schemas.User)
async def register_user(user: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    db_user_email = await crud.get_user_by_email(db, email=user.email)
    if db_user_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    db_user_username = await crud.get_user_by_username(db, username=user.username)
    if db_user_username:
        raise HTTPException(status_code=400, detail="Username already taken")

    return await crud.create_user(db=db, user=user)


@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: schemas.TokenRequestForm, db: AsyncSession = Depends(get_db)
):
    user = await crud.get_user_by_email(db, email=form_data.email)
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if form_data.remember_me:
        expires_delta = timedelta(days=30)
    else:
        expires_delta = timedelta(days=1)
    access_token = create_access_token(
        data={"sub": user.id},
        expires_delta=expires_delta,
    )
    return {"access_token": access_token, "token_type": "bearer", "user": user}


@router.get("/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=schemas.User)
async def update_my_profile(
    user_update: schemas.UserUpdate,
    current_user: models.User = Depends(require_auth),
    db: AsyncSession = Depends(get_db),
):
    """
    Updates the profile for the currently authenticated user.
    """
    # Check if the new username is already taken by ANOTHER user
    if user_update.username and user_update.username != current_user.username:
        existing_user = await crud.get_user_by_username(
            db, username=user_update.username
        )
        if existing_user:
            raise HTTPException(status_code=400, detail="Username is already taken.")

    updated_user = await crud.update_user_profile(
        db, user_id=current_user.id, user_update=user_update
    )
    return updated_user


@router.post("/me/change-password", status_code=status.HTTP_204_NO_CONTENT)
async def change_my_password(
    password_data: schemas.PasswordChange,
    current_user: models.User = Depends(require_auth),
    db: AsyncSession = Depends(get_db),
):
    # 1. Verify the user's current password
    if not security.verify_password(
        password_data.current_password, current_user.password
    ):
        raise HTTPException(status_code=400, detail="Incorrect current password")

    # 2. Hash the new password
    new_hashed_password = security.get_password_hash(password_data.new_password)

    # 3. Update the user's password in the database
    current_user.password = new_hashed_password
    db.add(current_user)
    await db.commit()

    # We don't need to return any content, just a success status
    return


@router.get("/me/all-contributions", response_model=schemas.UserContributionsResponse)
async def get_my_all_contributions(
    current_user: models.User = Depends(require_auth),
    db: AsyncSession = Depends(get_db),
):
    # 1. Fetch edits (this is already correct)
    user_edits = await crud.get_user_modification_requests(db, user_id=current_user.id)

    # 2. Fetch ALL new content by this user (published or not)
    # We'll create these new CRUD functions
    all_chapters = await crud.get_all_user_chapters(db, user_id=current_user.id)
    all_exams = await crud.get_all_user_exams(db, user_id=current_user.id)
    all_resources = await crud.get_all_user_resources(db, user_id=current_user.id)

    contribution_items = []

    # Process edits
    for edit in user_edits:
        contribution_items.append(
            schemas.UserContribution(
                type="Edit Suggestion",
                title=edit.proposed_title,
                status=edit.status.value,  # 'pending', 'approved', 'rejected'
                item_id=edit.id,
                content_type="edit",
                subject_id=edit.chapter.subject_id,
                chapter_id=edit.chapter_id,
            )
        )

    # --- THIS IS THE NEW LOGIC ---
    # Process new content, using the 'status' field
    for chapter in all_chapters:
        contribution_items.append(
            schemas.UserContribution(
                type="New Chapter",
                title=chapter.title,
                status=chapter.status.value,  # Use the new status field
                item_id=chapter.id,
                content_type="chapter",
                subject_id=chapter.subject_id,
                chapter_id=chapter.id,
            )
        )

    for exam in all_exams:
        contribution_items.append(
            schemas.UserContribution(
                type="New Exam",
                title=exam.title,
                status=exam.status.value,
                item_id=exam.id,
                content_type="exam",
                subject_id=exam.subject_id,
            )
        )

    for resource in all_resources:
        contribution_items.append(
            schemas.UserContribution(
                type="New Resource",
                title=resource.title,
                status=resource.status.value,
                item_id=resource.id,
                content_type="resource",
                subject_id=resource.subject_id,
            )
        )

    return {"contributions": contribution_items}
