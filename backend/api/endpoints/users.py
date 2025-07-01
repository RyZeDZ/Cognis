from jose import JWTError, jwt
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

import crud, schemas, models
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
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except (JWTError, ValidationError):
        raise credentials_exception

    user = await crud.get_user_by_username(db, username=username)
    if user is None:
        raise credentials_exception
    return user


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
    print("HJDSFG:L")
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
        data={"sub": user.username},
        expires_delta=expires_delta,
    )
    return {"access_token": access_token, "token_type": "bearer", "user": user}


@router.get("/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user
