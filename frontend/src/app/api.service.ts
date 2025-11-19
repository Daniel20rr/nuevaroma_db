import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API = 'http://localhost:8000';

// ====================== TIPOS ======================

// Estadísticas separadas por endpoint
export interface StatsStudents {
  labels: string[];
  data: number[];
}

export interface StatsMaterias {
  labels: string[];
  data: number[];
}

export interface StatsPromedioNotas {
  studentsLabels: string[];
  studentsData: number[];
  gradesLabels: string[];
  gradesData: number[];
}

// Estudiante
export interface Student {
  id: number;
  nombre: string;
  email?: string;
}

// Payload para crear o actualizar estudiante
export interface StudentPayload {
  nombre: string;
  email?: string;
}

// Materia
export interface Subject {
  id: number;
  nombre: string;
}

// Payload para crear o actualizar materia
export interface SubjectPayload {
  nombre: string;
}

// Nota
export interface Grade {
  id: number;
  estudianteId: number;
  materiaId: number;
  nota: number;
  estudiante?: Student;
  materia?: Subject;
}

// Payload para crear o actualizar nota
export interface GradePayload {
  estudianteId: number;
  materiaId: number;
  nota: number;
}

// ====================== TIPOS PARA TOP / ALERTS ======================
export interface StudentPerformance {
  id: number;
  nombre: string;
  avg: number;
  count: number;
}

export interface TopStudentsResponse {
  top: StudentPerformance[];
}

export interface LowGradesResponse {
  alerts: StudentPerformance[];
  threshold: number;
}

// ====================== SERVICIO ======================
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private jsonHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  // ====================== ESTUDIANTES ======================
  listStudents(q?: string): Observable<Student[]> {
    let url = API + '/estudiantes/';
    if (q) url += '?q=' + encodeURIComponent(q);
    return this.http.get<Student[]>(url);
  }

  createStudent(data: StudentPayload): Observable<Student> {
    return this.http.post<Student>(API + '/estudiantes/', data, { headers: this.jsonHeaders });
  }

  updateStudent(id: number, data: StudentPayload): Observable<Student> {
    return this.http.put<Student>(API + '/estudiantes/' + id, data, { headers: this.jsonHeaders });
  }

  deleteStudent(id: number): Observable<any> {
    return this.http.delete(API + '/estudiantes/' + id);
  }

  getStudent(id: number): Observable<Student> {
    return this.http.get<Student>(API + '/estudiantes/' + id);
  }

  // ====================== MATERIAS ======================
  listSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(API + '/materias/');
  }

  createSubject(data: SubjectPayload): Observable<Subject> {
    return this.http.post<Subject>(API + '/materias/', data, { headers: this.jsonHeaders });
  }

  updateSubject(id: number, data: SubjectPayload): Observable<Subject> {
    return this.http.put<Subject>(API + '/materias/' + id, data, { headers: this.jsonHeaders });
  }

  deleteSubject(id: number): Observable<any> {
    return this.http.delete(API + '/materias/' + id);
  }

  // ====================== NOTAS ======================
  listGrades(estudiante_id?: number): Observable<Grade[]> {
    let url = API + '/notas/';
    if (estudiante_id) url += '?estudiante_id=' + estudiante_id;
    return this.http.get<Grade[]>(url);
  }

  createGrade(data: GradePayload): Observable<Grade> {
    return this.http.post<Grade>(API + '/notas/', data, { headers: this.jsonHeaders });
  }

  updateGrade(id: number, data: GradePayload): Observable<Grade> {
    return this.http.put<Grade>(API + '/notas/' + id, data, { headers: this.jsonHeaders });
  }

  deleteGrade(id: number): Observable<any> {
    return this.http.delete(API + '/notas/' + id);
  }

  // ====================== ESTADÍSTICAS (ENDPOINTS CORRECTOS SEGÚN FASTAPI) ======================

  // Promedio de notas por MATERIA
  getStatsMaterias(): Observable<StatsMaterias> {
    return this.http.get<StatsMaterias>(API + '/stats/notas/materia');
  }

  // Promedio de notas por ESTUDIANTE
  getStatsStudents(): Observable<StatsStudents> {
    return this.http.get<StatsStudents>(API + '/stats/notas/estudiante');
  }

  // Estadísticas TOTALES (labels y data para ambos)
  getStatsTotales(): Observable<StatsPromedioNotas> {
    return this.http.get<StatsPromedioNotas>(API + '/stats/');
  }

  // Top mejores estudiantes (usa /stats/top-students)
  getTopStudents(limit: number = 5): Observable<TopStudentsResponse> {
    return this.http.get<TopStudentsResponse>(API + `/stats/top-students?limit=${limit}`);
  }

  // Alertas de notas bajas (usa /alerts/low-grades)
  getLowGrades(threshold: number = 3.0): Observable<LowGradesResponse> {
    return this.http.get<LowGradesResponse>(API + `/alerts/low-grades?threshold=${threshold}`);
  }
}
