from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import Optional, List, Any
from datetime import date

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
# ============== MATERIAS SIMPLE ======================
# =====================================================
class MateriaSimple(BaseModel):
    id: int
    nombre: str
    
    model_config = ConfigDict(from_attributes=True)

# =====================================================
# ===================== PROFESORES ====================
# =====================================================
class ProfesorBase(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100)
    apellido: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    telefono: Optional[str] = Field(None, max_length=20)
    especialidad: Optional[str] = Field(None, max_length=100)
    fecha_contratacion: Optional[date] = None

class ProfesorCreate(ProfesorBase):
    pass

class ProfesorUpdate(BaseModel):
    nombre: Optional[str] = Field(None, min_length=2, max_length=100)
    apellido: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    telefono: Optional[str] = Field(None, max_length=20)
    especialidad: Optional[str] = Field(None, max_length=100)
    fecha_contratacion: Optional[date] = None
    activo: Optional[bool] = None

class ProfesorOut(ProfesorBase):
    id: int
    activo: bool
    materias: List[MateriaSimple] = []
    
    model_config = ConfigDict(from_attributes=True)

class ProfesorSimple(BaseModel):
    id: int
    nombre: str
    apellido: str
    email: EmailStr
    especialidad: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

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

class ProfesorMateriaAsignacion(BaseModel):
    profesor_id: int
    materia_id: int