from pydantic import BaseModel
from typing import List, Optional

class ChapterBase(BaseModel):
    title: str
    content: str

class ChapterCreate(ChapterBase):
    pass

class Chapter(ChapterBase):
    id: int
    subject_id: int

    class Config:
        from_attributes = True


class SubjectBase(BaseModel):
    name: str
    year: int
    specialization: Optional[str] = None

class SubjectCreate(SubjectBase):
    pass

class Subject(SubjectBase):
    id: int
    chapters: List[Chapter] = []

    class Config:
        from_attributes = True

class SubjectSimple(SubjectBase):
    id: int
    
    class Config:
        from_attributes = True