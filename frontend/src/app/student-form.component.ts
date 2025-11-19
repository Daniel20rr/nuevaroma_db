import { Component, Output, EventEmitter } from '@angular/core';
import { StudentService } from './student.service';

@Component({
  selector: 'app-student-form',
  template: `
  <div class="card p-3 mt-3">
    <div class="row g-2 align-items-center">
      <div class="col">
        <input class="form-control" placeholder="Nombre del alumno" [(ngModel)]="nombre" />
      </div>
      <div class="col">
        <input class="form-control" placeholder="Correo" [(ngModel)]="email" type="email" />
      </div>
      <div class="col-auto">
        <button class="btn btn-success" (click)="create()">Agregar</button>
      </div>
    </div>
  </div>
  `
})
export class StudentFormComponent {

  nombre = '';
  email = '';

  @Output() refresh = new EventEmitter<void>();

  constructor(private svc: StudentService) {}

  create() {
    if (!this.nombre.trim()) {
      alert('⚠️ El nombre es obligatorio');
      return;
    }

    const data = { nombre: this.nombre.trim(), email: this.email.trim() };

    this.svc.create(data).subscribe({
      next: () => {
        alert('✅ Estudiante agregado correctamente');
        this.nombre = '';
        this.email = '';
        this.refresh.emit();
      },
      error: (err) => {
        console.error('Error creando estudiante:', err);
        alert('❌ Error al agregar estudiante');
      }
    });
  }
}
