from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    ForeignKey,
    Boolean,
    DateTime,
    Enum,
    DateTime,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum


class RequestStatus(enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    year = Column(Integer, index=True)
    specialization = Column(String, nullable=True, index=True)
    visit_count = Column(Integer, default=0, nullable=False, server_default="0")

    exams = relationship("Exam", back_populates="subject", cascade="all, delete-orphan")
    chapters = relationship(
        "Chapter", back_populates="subject", cascade="all, delete-orphan"
    )
    resources = relationship(
        "Resource", back_populates="subject", cascade="all, delete-orphan"
    )


class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text, nullable=False)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    status = Column(Enum(RequestStatus), default=RequestStatus.approved, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user = relationship("User", back_populates="chapters")
    subject = relationship("Subject", back_populates="chapters")
    modification_requests = relationship(
        "ModificationRequest", back_populates="chapter"
    )
    uploaded_images = relationship(
        "UploadedImage", back_populates="chapter", cascade="all, delete-orphan"
    )


class Exam(Base):
    __tablename__ = "exams"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    file_url = Column(String, nullable=False)
    status = Column(Enum(RequestStatus), default=RequestStatus.pending, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(
        Integer, ForeignKey("users.id"), nullable=False
    )  # Track who submitted it
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)

    subject = relationship("Subject", back_populates="exams")
    user = relationship("User")


# --- NEW RESOURCE MODEL ---
class Resource(Base):
    __tablename__ = "resources"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    link_url = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum(RequestStatus), default=RequestStatus.pending, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)

    subject = relationship("Subject", back_populates="resources")
    user = relationship("User")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    google_id = Column(String, unique=True, nullable=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    password_reset_token = Column(String, unique=True, nullable=True)
    password_reset_expires = Column(DateTime(timezone=True), nullable=True)
    is_admin = Column(Boolean, default=False, nullable=False)
    profile_image_url = Column(String, nullable=True)
    chapters = relationship("Chapter", back_populates="user")
    modification_requests = relationship("ModificationRequest", back_populates="user")
    notifications = relationship(
        "Notification", back_populates="user", cascade="all, delete-orphan"
    )
    uploaded_images = relationship(
        "UploadedImage", back_populates="user", cascade="all, delete-orphan"
    )
    guides = relationship("Guide", back_populates="user", cascade="all, delete-orphan")


class ModificationRequest(Base):
    __tablename__ = "modification_requests"

    id = Column(Integer, primary_key=True, index=True)

    # The proposed new title and content
    proposed_title = Column(String, nullable=False)
    proposed_content = Column(Text, nullable=False)

    # Status of the request
    status = Column(Enum(RequestStatus), default=RequestStatus.pending, nullable=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    reviewed_at = Column(DateTime(timezone=True), nullable=True)

    # Optional comment from the admin who reviewed it
    reviewer_comment = Column(Text, nullable=True)

    # --- Relationships ---
    # Link to the user who submitted the request
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="modification_requests")

    # Link to the chapter this request is for
    # We make this nullable because a request could be for a guide in the future
    chapter_id = Column(Integer, ForeignKey("chapters.id"), nullable=True)
    chapter = relationship("Chapter", back_populates="modification_requests")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)

    # The message that will be displayed to the user
    # e.g., "Your suggestion for 'Chapter 1' was approved."
    message = Column(String, nullable=False)

    # A link to the relevant page (e.g., the chapter that was edited)
    link = Column(String, nullable=True)

    # Status to track if the user has seen the notification
    is_read = Column(Boolean, default=False, nullable=False)

    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # --- Relationship to User ---
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="notifications")


class UploadedImage(Base):
    __tablename__ = "uploaded_images"

    id = Column(Integer, primary_key=True, index=True)

    # The full public URL from Supabase
    public_url = Column(String, nullable=False)

    # The path used for deletion (e.g., 'public/uuid.png')
    storage_path = Column(String, unique=True, nullable=False)

    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # --- Relationships ---
    # Link to the user who uploaded the image
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="uploaded_images")

    # Link to the chapter this image is used in.
    # We make this nullable because an image could be for a guide or a profile picture later.
    chapter_id = Column(Integer, ForeignKey("chapters.id"), nullable=True)
    chapter = relationship("Chapter", back_populates="uploaded_images")

    guide_id = Column(Integer, ForeignKey("guides.id"), nullable=True)
    guide = relationship("Guide", back_populates="uploaded_images")


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, nullable=False)
    primary = Column(Boolean, default=False)

    guides = relationship("Guide", secondary="guide_tags", back_populates="tags")


class Guide(Base):
    __tablename__ = "guides"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_modified = Column(DateTime(timezone=True), onupdate=func.now())

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="guides")

    uploaded_images = relationship("UploadedImage", back_populates="guide")
    tags = relationship("Tag", secondary="guide_tags", back_populates="guides")


class GuideTag(Base):
    __tablename__ = "guide_tags"

    guide_id = Column(Integer, ForeignKey("guides.id"), primary_key=True)
    tag_id = Column(Integer, ForeignKey("tags.id"), primary_key=True)
