import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-subject-list',
  template: `
  <div class="text-center mt-3">
      <img src="assets/logo.png" width="80" class="mb-2"/>
      <h3 class="fw-bold">Listado de Materias</h3>
  </div>

  <!-- FORMULARIO -->
  <app-subject-form></app-subject-form>

  <div class="card mt-3">
    <div class="card-body">

      <div class="d-flex mb-2">
        <div class="me-auto"></div>
        <div>
          <button class="btn btn-sm btn-primary" (click)="load()">Refrescar</button>
        </div>
      </div>

      <table class="table table-striped">
        <thead>
            <tr><th>ID</th><th>Nombre</th></tr>
        </thead>

        <tbody>
          <tr *ngFor="let s of paginatedData">
            <td>{{ s.id }}</td>
            <td>{{ s.nombre }}</td>
          </tr>
        </tbody>
      </table>

      <!-- PAGINACIÓN -->
      <nav class="mt-2 d-flex justify-content-center">
        <ul class="pagination">

          <li class="page-item" [class.disabled]="page === 1">
            <a class="page-link" (click)="prevPage()">Anterior</a>
          </li>

          <li class="page-item disabled">
            <span class="page-link">
              Página {{page}} / {{totalPages}}
            </span>
          </li>

          <li class="page-item" [class.disabled]="page === totalPages">
            <a class="page-link" (click)="nextPage()">Siguiente</a>
          </li>

        </ul>
      </nav>

    </div>
  </div>
  `
})
export class SubjectListComponent implements OnInit {

  subjects:any[] = [];
  paginatedData:any[] = [];

  page:number = 1;
  pageSize:number = 5;
  totalPages:number = 1;

  constructor(private svc: ApiService){}

  ngOnInit(){
    this.load();
  }

  load(){
    this.svc.listSubjects().subscribe((r:any)=>{
      this.subjects = r;
      this.updatePagination();
    });
  }

  updatePagination(){
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.totalPages = Math.ceil(this.subjects.length / this.pageSize);
    this.paginatedData = this.subjects.slice(start, end);
  }

  nextPage(){
    if (this.page < this.totalPages){
      this.page++;
      this.updatePagination();
    }
  }

  prevPage(){
    if (this.page > 1){
      this.page--;
      this.updatePagination();
    }
  }
}
