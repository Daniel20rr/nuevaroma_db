import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';

interface Student {
  id: number;
  nombre: string;
}

interface Subject {
  id: number;
  nombre: string;
}

interface GradePayload {
  estudianteId: number;  // camelCase
  materiaId: number;     // camelCase
  nota: number;
}

@Component({
  selector: 'app-grade-form',
  template: `
    <div class="card p-3 mt-3">
      <div class="row g-2 align-items-center">

        <!-- Selección de estudiante -->
        <div class="col-md-4">
          <select class="form-select" [(ngModel)]="id_estudiante">
            <option [ngValue]="null" disabled>Seleccionar alumno</option>
            <option *ngFor="let s of estudiantes" [ngValue]="s.id">{{ s.nombre }}</option>
          </select>
        </div>

        <!-- Selección de materia -->
        <div class="col-md-4">
          <select class="form-select" [(ngModel)]="id_materia">
            <option [ngValue]="null" disabled>Seleccionar materia</option>
            <option *ngFor="let m of materias" [ngValue]="m.id">{{ m.nombre }}</option>
          </select>
        </div>

        <!-- Campo de nota -->
        <div class="col-md-2">
          <input 
            type="number"
            class="form-control"
            [(ngModel)]="nota"
            placeholder="Nota"
            min="0"
            max="10"
            step="0.1"
          />
        </div>

        <!-- Botón de agregar -->
        <div class="col-md-2">
          <button class="btn btn-success w-100" (click)="create()">Agregar Nota</button>
        </div>

      </div>
    </div>
  `
})
export class GradeFormComponent implements OnInit {
  estudiantes: Student[] = [];
  materias: Subject[] = [];

  id_estudiante: number | null = null;
  id_materia: number | null = null;
  nota: number | null = null;

  constructor(private svc: ApiService) {}

  ngOnInit(): void {
    this.loadStudents();
    this.loadSubjects();
  }

  private loadStudents(): void {
    this.svc.listStudents().subscribe({
      next: (res: Student[]) => this.estudiantes = res,
      error: (err) => console.error('❌ Error cargando estudiantes:', err)
    });
  }

  private loadSubjects(): void {
    this.svc.listSubjects().subscribe({
      next: (res: Subject[]) => this.materias = res,
      error: (err) => console.error('❌ Error cargando materias:', err)
    });
  }

  create(): void {
    if (this.id_estudiante === null || this.id_materia === null || this.nota === null) {
      alert('⚠️ Completa todos los campos antes de continuar');
      return;
    }

    const payload: GradePayload = {
      estudianteId: this.id_estudiante!,  // camelCase
      materiaId: this.id_materia!,
      nota: this.nota!
    };

    this.svc.createGrade(payload).subscribe({
      next: () => {
        alert('✅ Nota agregada correctamente');
        this.resetForm();
      },
      error: (err) => {
        console.error('❌ Error al agregar nota:', err);
        alert('❌ Error al agregar la nota, revisa la consola');
      }
    });
  }

  private resetForm(): void {
    this.id_estudiante = null;
    this.id_materia = null;
    this.nota = null;
  }
}
