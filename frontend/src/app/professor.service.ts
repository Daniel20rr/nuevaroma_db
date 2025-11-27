// professor.service.ts (Versión Arreglada)

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 1. **Punto clave:** Define la URL de la API directamente como en StudentService.
// Esto elimina la dependencia inmediata del archivo environment.ts
const API_URL = 'http://localhost:8000'; 

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {

  // Ya no necesitamos 'private apiUrl = environment.apiUrl;' si usamos la constante API_URL

  constructor(private http: HttpClient) {}

  listarProfesores(): Observable<any[]> {
    // Usamos la constante API_URL
    return this.http.get<any[]>(`${API_URL}/profesores/`);
  }

  obtenerProfesor(id: number): Observable<any> {
    return this.http.get<any>(`${API_URL}/profesores/${id}`);
  }

  crearProfesor(data: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/profesores/`, data);
  }

  actualizarProfesor(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${API_URL}/profesores/${id}`, data);
  }

  eliminarProfesor(id: number): Observable<any> {
    return this.http.delete<any>(`${API_URL}/profesores/${id}`);
  }
}