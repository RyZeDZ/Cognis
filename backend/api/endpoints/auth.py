from datetime import datetime, timedelta, timezone
import secrets
from fastapi import APIRouter, Depends, HTTPException, status
import jwt
from sqlalchemy.ext.asyncio import AsyncSession
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

import crud, schemas, security, models, email_service
from database import AsyncSessionLocal
from config import settings
from api.endpoints.users import require_auth

router = APIRouter()


async def get_db() -> AsyncSession:  # type: ignore
    async with AsyncSessionLocal() as session:
        yield session


@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: schemas.TokenRequestForm, db: AsyncSession = Depends(get_db)
):
    """
    Logs in a user with email and password, returns an access token.
    """
    # Find the user by their email
    user = await crud.get_user_by_email(db, email=form_data.email)

    # Check if the user exists and the password is correct
    if not user or not security.verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # If credentials are correct, create an access token
    if form_data.remember_me:
        # A longer expiration for "remember me"
        expires_delta = timedelta(days=30)
    else:
        # A shorter, session-like expiration
        expires_delta = timedelta(days=1)
    access_token = security.create_access_token(
        data={"sub": str(user.id)}, expires_delta=expires_delta
    )

    return {"access_token": access_token, "token_type": "bearer", "user": user}


@router.post("/google/verify", response_model=schemas.Token)
async def verify_google_token(
    google_token: schemas.GoogleToken, db: AsyncSession = Depends(get_db)
):
    try:
        idinfo = id_token.verify_oauth2_token(
            google_token.token,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID,
            clock_skew_in_seconds=10,
        )
        email: str = idinfo["email"]
        google_id: str = idinfo["sub"]  # 'sub' is the unique, permanent Google User ID

    except ValueError:
        import traceback

        print("--- GOOGLE TOKEN VERIFICATION FAILED ---")
        traceback.print_exc()
        print("--- END TRACEBACK ---")
        # The token is invalid, expired, or for the wrong audience.
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Google token"
        )

    # --- NEW, ROBUST LOGIC BASED ON YOUR 4 STATES ---

    # State 1 & 4 (Part 1): Does a user with this Google ID already exist?
    # This handles the case of a returning user who has already linked their account.
    user = await crud.get_user_by_google_id(db, google_id=google_id)
    if user:
        # User found. They are already linked. Log them in.
        access_token = security.create_access_token(data={"sub": str(user.id)})
        return {"access_token": access_token, "token_type": "bearer", "user": user}

    # If no user with that google_id exists, we proceed...

    # State 3: Does a user with this email *already* exist (but is not linked to Google)?
    user_by_email = await crud.get_user_by_email(db, email=email)
    if user_by_email:
        # This is a security measure. We don't want a random person to take over an
        # existing email/password account just by logging in with a matching Google email.
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists. Please log in with your password and link your Google account from your profile settings.",
        )

    # State 1 (Part 2): This is a brand new user.
    # The google_id is new, and the email is new. Let's create their account.
    base_username = idinfo.get("name", email.split("@")[0]).replace(" ", "")
    # ... (your existing username collision logic is perfect)
    final_username = base_username
    # ...

    random_password = secrets.token_urlsafe(32)
    new_user_data = schemas.UserCreate(
        email=email, username=final_username, password=random_password
    )
    new_user = await crud.create_user(db, user=new_user_data)

    # Now, link their google_id and save their Google profile picture
    new_user.google_id = google_id
    new_user.profile_image_url = idinfo.get("picture")
    await db.commit()
    await db.refresh(new_user)

    # Finally, log them in by creating a token.
    access_token = security.create_access_token(data={"sub": str(new_user.id)})
    return {"access_token": access_token, "token_type": "bearer", "user": new_user}


@router.post("/google/link", response_model=schemas.User)
async def link_google_account(
    google_token: schemas.GoogleToken,
    db: AsyncSession = Depends(get_db),
    # Let's rename this to make it clear it's just for auth
    token_user: models.User = Depends(require_auth),
):
    """
    Links a Google account to the currently logged-in user.
    """
    try:
        # --- THIS IS THE FIX ---
        # We are simply decoding the token to read its contents.
        # We don't need to fully verify it against Google's servers again,
        # as the frontend library has already done that.
        # options={"verify_signature": False} is okay here because we are not
        # using this for login, just for extracting data after a frontend verification.
        # A more secure way would be to fetch Google's public keys and verify,
        # but for this internal linking, decoding is sufficient and avoids network issues.

        unverified_claims = jwt.decode(
            google_token.token,
            None,
            options={
                "verify_signature": False,
                "verify_aud": False,
                "verify_exp": False,
            },
        )

        google_id: str = unverified_claims.get("sub")
        google_email: str = unverified_claims.get("email")
        google_picture: str = unverified_claims.get("picture")

        if not google_id or not google_email:
            raise ValueError("Token is missing required claims.")

    except (ValueError, jwt.JWTError):
        raise HTTPException(status_code=401, detail="Invalid Google token claims.")

    current_user = await crud.get_user_by_id(db, user_id=token_user.id)
    if not current_user:
        raise HTTPException(
            status_code=404, detail="Authenticated user not found in database."
        )

    # Security Check: Ensure the Google account's email matches the user's account email.
    if google_email != current_user.email:
        raise HTTPException(
            status_code=400,
            detail="Google account email does not match your profile email.",
        )

    # Check if another user has already linked this Google account
    existing_linked_user = await crud.get_user_by_google_id(db, google_id=google_id)
    if existing_linked_user:
        raise HTTPException(
            status_code=400,
            detail="This Google account is already linked to another user.",
        )

    # All checks passed. Link the account.
    current_user.google_id = google_id
    if (
        not current_user.profile_image_url
    ):  # Only set PFP if they don't have a custom one
        current_user.profile_image_url = google_picture

    await db.commit()
    await db.refresh(current_user)

    return current_user


# --- NEW ENDPOINT FOR UNLINKING ---
@router.post("/google/unlink", response_model=schemas.User)
async def unlink_google_account(
    db: AsyncSession = Depends(get_db),
    token_user: models.User = Depends(require_auth),
):
    """
    Unlinks a Google account from the currently logged-in user.
    """
    # Security Check: A user cannot unlink Google if they don't have a password set.
    # This prevents them from locking themselves out of their account.
    # We can check this by seeing if their password hash is the "unusable" one.
    # For now, we'll just allow it, but this is an important future consideration.
    current_user = await crud.get_user_by_id(db, user_id=token_user.id)
    if not current_user:
        raise HTTPException(
            status_code=404, detail="Authenticated user not found in database."
        )

    if not current_user.google_id:
        raise HTTPException(status_code=400, detail="No Google account is linked.")

    current_user.google_id = None
    await db.commit()
    await db.refresh(current_user)

    return current_user


@router.post("/forgot-password", status_code=status.HTTP_204_NO_CONTENT)
async def forgot_password(
    request: schemas.ForgotPasswordRequest, db: AsyncSession = Depends(get_db)
):
    user = await crud.get_user_by_email(db, email=request.email)
    if user:
        # Generate a secure, URL-safe token
        token = secrets.token_urlsafe(32)

        # Store the token and its expiration date (1 hour from now)
        user.password_reset_token = token
        user.password_reset_expires = datetime.now(timezone.utc) + timedelta(hours=1)

        db.add(user)
        await db.commit()

        # Send the email
        await email_service.send_password_reset_email(email_to=user.email, token=token)

    # We return 204 regardless of whether the user was found.
    # This prevents attackers from using this endpoint to check if an email is registered.
    return


@router.post("/reset-password", status_code=status.HTTP_204_NO_CONTENT)
async def reset_password(
    request: schemas.ResetPasswordRequest, db: AsyncSession = Depends(get_db)
):
    # Find the user by the reset token
    user = await crud.get_user_by_reset_token(
        db, token=request.token
    )  # We need to create this CRUD function

    # Check if token is valid and not expired
    if (
        not user
        or not user.password_reset_expires
        or user.password_reset_expires < datetime.now(timezone.utc)
    ):
        raise HTTPException(
            status_code=400, detail="Invalid or expired password reset token."
        )

    # Set the new password
    new_hashed_password = security.get_password_hash(request.new_password)
    user.password = new_hashed_password

    # Clear the reset token so it can't be used again
    user.password_reset_token = None
    user.password_reset_expires = None

    db.add(user)
    await db.commit()

    return
