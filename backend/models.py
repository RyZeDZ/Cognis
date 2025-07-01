from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base
from pydantic import EmailStr


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    year = Column(Integer, index=True)
    specialization = Column(String, nullable=True, index=True)

    chapters = relationship(
        "Chapter", back_populates="subject", cascade="all, delete-orphan"
    )


class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text, nullable=False)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)

    subject = relationship("Subject", back_populates="chapters")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)
