import { Component } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-subject-form',
  template: `
  <div class="card p-3 mt-3">
    <div class="row g-2 align-items-center">
      <div class="col">
        <input 
          class="form-control" 
          placeholder="Nombre de la materia" 
          [(ngModel)]="nombre_materia" />
      </div>

      <div class="col-auto">
        <button class="btn btn-success" (click)="create()">Agregar Materia</button>
      </div>
    </div>
  </div>
  `
})
export class SubjectFormComponent {
  nombre_materia = '';

  constructor(private svc: ApiService) {}

  create() {
    if (!this.nombre_materia.trim()) {
      alert('El nombre de la materia es obligatorio');
      return;
    }

    const payload = { nombre: this.nombre_materia };

    this.svc.createSubject(payload).subscribe({
      next: () => {
        this.nombre_materia = '';
        alert('Materia agregada correctamente');
      },
      error: () => alert('Error al crear la materia')
    });
  }
}
