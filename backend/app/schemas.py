from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Any

# =====================================================
# ================ ESTUDIANTES ========================
# =====================================================
class EstudianteBase(BaseModel):
    nombre: str
    email: str

class EstudianteCreate(EstudianteBase):
    pass

class EstudianteUpdate(BaseModel):
    nombre: Optional[str] = None
    email: Optional[str] = None

class EstudianteOut(EstudianteBase):
    id: int

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

# =====================================================
# ===================== MATERIAS ======================
# =====================================================
class MateriaBase(BaseModel):
    nombre: str

class MateriaCreate(MateriaBase):
    pass

class MateriaOut(MateriaBase):
    id: int

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

# =====================================================
# ======================= NOTAS ========================
# =====================================================
class NotaBase(BaseModel):
    estudiante_id: int = Field(..., alias="estudianteId")
    materia_id: int = Field(..., alias="materiaId")
    nota: float

    model_config = ConfigDict(populate_by_name=True)

class NotaCreate(NotaBase):
    pass

class NotaUpdate(BaseModel):
    estudiante_id: Optional[int] = Field(None, alias="estudianteId")
    materia_id: Optional[int] = Field(None, alias="materiaId")
    nota: Optional[float] = None

    model_config = ConfigDict(populate_by_name=True)

class NotaOut(NotaBase):
    id: int
    estudiante: Optional[EstudianteOut] = None
    materia: Optional[MateriaOut] = None

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

# =====================================================
# ================ MÓDULO EXCEL =======================
# =====================================================
class ExcelRow(BaseModel):
    values: List[Any]

class ExcelSheetPreview(BaseModel):
    name: str
    headers: List[str]
    data: List[List[Any]]

class ExcelDuplicates(BaseModel):
    sheet: str
    rows: List[int]

class ExcelUploadResponse(BaseModel):
    message: str
    sheets: List[ExcelSheetPreview]
    duplicates: List[ExcelDuplicates]

class ExcelInsertResponse(BaseModel):
    insertados: int
    existentes: int
    message: str