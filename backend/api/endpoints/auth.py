import random
import secrets
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

import crud, schemas, security
from database import AsyncSessionLocal
from config import settings

router = APIRouter()


async def get_db() -> AsyncSession:  # type: ignore
    async with AsyncSessionLocal() as session:
        yield session


@router.post("/google/verify", response_model=schemas.Token)
async def verify_google_token(
    google_token: schemas.GoogleToken, db: AsyncSession = Depends(get_db)
):
    try:
        idinfo = id_token.verify_oauth2_token(
            google_token.token, google_requests.Request(), settings.GOOGLE_CLIENT_ID
        )
        email = idinfo["email"]

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Google token"
        )
    db_user = await crud.get_user_by_email(db, email=email)

    if not db_user:
        base_username = idinfo.get("name", email.split("@")[0]).replace(" ", "")
        existing_user_with_username = await crud.get_user_by_username(
            db, username=base_username
        )

        final_username = base_username
        while existing_user_with_username:
            random_suffix = "".join(random.choices("0123456789", k=4))
            final_username = f"{base_username}{random_suffix}"
            existing_user_with_username = await crud.get_user_by_username(
                db, username=final_username
            )

        random_password = secrets.token_urlsafe(32)
        new_user_data = schemas.UserCreate(
            email=email, username=final_username, password=random_password
        )
        db_user = await crud.create_user(db, user=new_user_data)

    access_token = security.create_access_token(data={"sub": db_user.username})
    return {"access_token": access_token, "token_type": "bearer", "user": db_user}
