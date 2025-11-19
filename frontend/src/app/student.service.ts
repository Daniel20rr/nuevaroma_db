import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8000';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(private http: HttpClient) {}

  // 🔹 Listar estudiantes (opcionalmente con búsqueda)
  list(q?: string): Observable<any> {
    let url = `${API_URL}/estudiantes/`;
    if (q) url += `?q=${encodeURIComponent(q)}`;
    return this.http.get(url);
  }

  // 🔹 Crear estudiante
  create(data: any): Observable<any> {
    return this.http.post(`${API_URL}/estudiantes/`, data);
  }

  // 🔹 Actualizar estudiante
  update(id: number, data: any): Observable<any> {
    return this.http.put(`${API_URL}/estudiantes/${id}`, data);
  }

  // 🔹 Eliminar estudiante
  delete(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/estudiantes/${id}`);
  }

  // 🔹 Obtener estudiante por ID
  getById(id: number): Observable<any> {
    return this.http.get(`${API_URL}/estudiantes/${id}`);
  }
}
