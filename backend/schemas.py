from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional


# Chapter Schemas
class ChapterBase(BaseModel):
    title: str
    content: str


class ChapterCreate(ChapterBase):
    subject_id: int


class Chapter(ChapterBase):
    id: int
    subject_id: int

    class Config:
        from_attributes = True


# Subject Schemas
class SubjectBase(BaseModel):
    name: str
    year: int
    specialization: Optional[str] = None


class SubjectCreate(SubjectBase):
    pass


class NewSubjectWithChapter(BaseModel):
    subject_name: str
    subject_year: int
    subject_specialization: Optional[str] = None
    chapter_title: str
    chapter_content: str


class Subject(SubjectBase):
    id: int
    chapters: List[Chapter] = []

    class Config:
        from_attributes = True


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
