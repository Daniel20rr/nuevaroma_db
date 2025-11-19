import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-grade-list',
  template: `
    <div class="card mt-3 shadow-sm">
      <div class="card-body">

        <h3 class="text-center mb-3 fw-bold">Listado de Notas</h3>

        <app-grade-form></app-grade-form>

        <div class="d-flex justify-content-end mb-3 mt-3">
          <button class="btn btn-secondary" (click)="load()">Refrescar</button>
        </div>

        <table class="table table-striped table-bordered align-middle">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Alumno</th>
              <th>Materia</th>
              <th>Nota</th>
            </tr>
          </thead>

          <tbody>
            <tr *ngFor="let g of grades | paginate: { itemsPerPage: pageSize, currentPage: page }">
              <td>{{ g.id }}</td>
              <td>{{ g.estudiante?.nombre }}</td>
              <td>{{ g.materia?.nombre }}</td>
              <td>{{ g.nota }}</td>
            </tr>
          </tbody>
        </table>

        <pagination-controls 
          class="text-center"
          (pageChange)="page = $event"
          previousLabel="Anterior"
          nextLabel="Siguiente">
        </pagination-controls>

      </div>
    </div>
  `
})
export class GradeListComponent implements OnInit {
  grades: any[] = [];
  page = 1;
  pageSize = 5;

  constructor(private svc: ApiService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.svc.listGrades().subscribe((res: any[]) => {
      this.grades = res;
    });
  }
}
