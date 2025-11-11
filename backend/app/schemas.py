from pydantic import BaseModel

class StudentBase(BaseModel):
    name: str
    email: str | None = None


class StudentCreate(StudentBase):
    pass


class StudentUpdate(BaseModel):
    name: str | None = None
    email: str | None = None


class StudentOut(StudentBase):
    id: int

    class Config:
        from_attributes = True  # ✅ Pydantic v2


class SubjectBase(BaseModel):
    name: str


class SubjectCreate(SubjectBase):
    pass


class SubjectOut(SubjectBase):
    id: int

    class Config:
        from_attributes = True  # ✅ Pydantic v2


class GradeBase(BaseModel):
    student_id: int
    subject_id: int
    grade: float


class GradeCreate(GradeBase):
    pass


class GradeOut(GradeBase):
    id: int
    student: StudentOut
    subject: SubjectOut

    class Config:
        from_attributes = True  # ✅ Pydantic v2
