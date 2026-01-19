from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from models import RequestStatus


# Chapter Schemas
class ChapterBase(BaseModel):
    title: str
    content: str


class ChapterCreate(ChapterBase):
    pass


class ChapterCreateWithId(ChapterBase):
    subject_id: int


class Chapter(ChapterBase):
    id: int
    subject_id: int

    class Config:
        from_attributes = True


# Subject Schemas
class SubjectBase(BaseModel):
    name: str = Field(..., max_length=64)
    year: int = Field(..., ge=1, le=5)
    specialization: Optional[str] = None


class SubjectCreate(SubjectBase):
    pass


class ChapterUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None


class NewSubjectWithChapter(BaseModel):
    subject_name: str
    subject_year: int
    subject_specialization: Optional[str] = None
    chapter_title: str
    chapter_content: str


class SubjectSimple(SubjectBase):
    id: int

    class Config:
        from_attributes = True


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=32)


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class User(UserBase):
    id: int
    is_admin: bool
    profile_image_url: Optional[str] = None
    google_id: Optional[str] = None

    class Config:
        from_attributes = True


class UserSimple(BaseModel):
    id: int
    username: str
    profile_image_url: Optional[str] = None

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    profile_image_url: Optional[str] = None


# --- NEW EXAM SCHEMAS ---
class ExamBase(BaseModel):
    title: str
    file_url: str


class ExamCreate(ExamBase):
    pass


class Exam(ExamBase):
    id: int
    status: RequestStatus
    subject_id: int
    user: UserSimple  # To show who submitted it

    class Config:
        from_attributes = True


# --- NEW RESOURCE SCHEMAS ---
class ResourceBase(BaseModel):
    title: str
    link_url: str
    description: Optional[str] = None


class ResourceCreate(ResourceBase):
    pass


class Resource(ResourceBase):
    id: int
    status: RequestStatus
    subject_id: int
    user: UserSimple

    class Config:
        from_attributes = True


class Subject(SubjectBase):
    id: int
    chapters: List[Chapter] = []
    exams: List[Exam] = []
    resources: List[Resource] = []

    class Config:
        from_attributes = True


# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user: User


class TokenData(BaseModel):
    username: Optional[str] = None


class TokenRequestForm(BaseModel):
    email: str
    password: str
    remember_me: bool = False


class GoogleToken(BaseModel):
    token: str


class UserSimple(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True


class ChapterSimple(BaseModel):
    id: int
    title: str

    class Config:
        from_attributes = True


# --- MODIFICATION REQUEST SCHEMAS ---
class ModificationRequestBase(BaseModel):
    proposed_title: str
    proposed_content: str


class ModificationRequestCreate(ModificationRequestBase):
    pass  # No extra fields needed for creation


class ModificationRequest(ModificationRequestBase):
    # This is the full model we can return from the API
    id: int
    status: RequestStatus  # Use the Enum for type safety
    user_id: int
    chapter_id: int
    user: UserSimple
    chapter: Chapter

    class Config:
        from_attributes = True


class RejectionRequest(BaseModel):
    comment: str


class Notification(BaseModel):
    id: int
    message: str
    link: Optional[str] = None
    is_read: bool
    created_at: datetime  # Make sure datetime is imported from datetime

    class Config:
        from_attributes = True


# This is the special response model for our GET endpoint
class NotificationsResponse(BaseModel):
    notifications: List[Notification]
    unread_count: int


class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)


class PendingItem(BaseModel):
    item_type: str  # 'edit', 'new_chapter', 'new_exam', 'new_resource'
    item_id: int
    title: str
    subject_name: str
    user: UserSimple
    created_at: datetime


class ReviewQueueResponse(BaseModel):
    items: List[PendingItem]


class UserContribution(BaseModel):
    # This will represent one row in the user's "My Contributions" table
    type: str  # 'edit', 'New Chapter', 'New Exam', 'New Resource'
    title: str
    status: str  # 'Pending', 'Approved', 'Rejected', 'Published'
    item_id: int
    content_type: str  # 'chapter', 'exam', 'resource'
    subject_id: int | None = None
    chapter_id: int | None = None


class UserContributionsResponse(BaseModel):
    contributions: List[UserContribution]
