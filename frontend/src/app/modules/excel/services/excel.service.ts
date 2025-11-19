import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';

// ===============================================================
// 📌 INTERFACES NECESARIAS PARA EVITAR ERRORES TYPESCRIPT
// ===============================================================
export interface SheetPreview {
  name: string;
  headers: string[];
  data: any[][];
}

export interface UploadResponse {
  message: string;
  sheets: SheetPreview[];
}

export interface StudentStats {
  labels: string[];
  data: number[];
}

export interface SubjectStats {
  labels: string[];
  data: number[];
}

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  private ws!: WebSocket | null;
  private progressSubject = new Subject<any>();
  progress$ = this.progressSubject.asObservable();

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private zone: NgZone) {}

  // ===============================================================
  // 📡 WEBSOCKET – Recibir progreso del backend
  // ===============================================================
  connectWebsocket(): void {
    if (this.ws) return;

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const url = `${protocol}://${window.location.hostname}:8000/ws/excel-progress`;

    this.ws = new WebSocket(url);

    this.ws.onmessage = (ev) => {
      this.zone.run(() => {
        try {
          const data = JSON.parse(ev.data);
          this.progressSubject.next(data);
        } catch {
          this.progressSubject.next({ message: ev.data });
        }
      });
    };

    this.ws.onclose = () => { 
      this.ws = null; 
    };

    this.ws.onerror = (err) => console.error('WebSocket error:', err);
  }

  disconnectWebsocket(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // ===============================================================
  // 📌 1. SUBIR ARCHIVO EXCEL
  // ===============================================================
  uploadFile(file: File): Observable<UploadResponse> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<UploadResponse>(`${this.apiUrl}/upload-excel/`, form);
  }

  // ===============================================================
  // 📌 2. OBTENER VISTA PREVIA DE TODAS LAS HOJAS
  // ===============================================================
  getPreview(): Observable<SheetPreview[]> {
    return this.http.get<SheetPreview[]>(`${this.apiUrl}/preview-sheets/`);
  }

  // ===============================================================
  // 📌 3. INSERTAR FILAS VALIDADAS DEL PREVIEW
  // ===============================================================
  insertRows(rows: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/insert-preview/`, { rows });
  }

  // ===============================================================
// 📌 4. OBTENER ESTADÍSTICAS DE ESTUDIANTES (Para gráficos)
// ===============================================================
getStudentStats(): Observable<StudentStats> {
  return this.http.get<StudentStats>(`${this.apiUrl}/stats/notas/estudiante`);
}

// ===============================================================
// 📌 5. OBTENER ESTADÍSTICAS DE MATERIAS (Para gráficos)
// ===============================================================
getSubjectStats(): Observable<SubjectStats> {
  return this.http.get<SubjectStats>(`${this.apiUrl}/stats/notas/materia`);
}

}