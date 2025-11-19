import { Component, OnInit } from '@angular/core';
import { StudentService } from './student.service';

@Component({
  selector: 'app-student-list',
  template: `
  <div class="card mt-3">
    <div class="card-body">

      <h3 class="text-center mb-3">Listado de Estudiantes</h3>

      <!-- FORMULARIO INTEGRADO PARA AGREGAR -->
      <app-student-form (refresh)="load()"></app-student-form>

      <div class="row mb-3 mt-3">
        <div class="col">
          <input class="form-control" placeholder="Buscar por nombre o email"
            [(ngModel)]="query" (input)="search()" />
        </div>

        <div class="col-auto">
          <button class="btn btn-secondary" (click)="load()">Refrescar</button>
        </div>
      </div>

      <table class="table table-striped">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let s of students | paginate: { itemsPerPage: pageSize, currentPage: page }">
            <td>{{s.id}}</td>
            <td>{{s.nombre}}</td>
            <td>{{s.email}}</td>
            <td>
              <button class="btn btn-sm btn-primary me-1" (click)="edit(s)">Editar</button>
              <button class="btn btn-sm btn-danger" (click)="remove(s.id)">Eliminar</button>
            </td>
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
export class StudentListComponent implements OnInit {

  students: any[] = [];
  query: string = '';

  page: number = 1;
  pageSize: number = 5;

  constructor(private svc: StudentService){}

  ngOnInit(){
    this.load();
  }

  load(){
    this.svc.list().subscribe((r:any)=> this.students = r);
  }

  search(){
    this.svc.list(this.query).subscribe((r:any)=> this.students = r);
  }

  edit(s:any){
    const nuevoNombre = prompt('Nuevo nombre', s.nombre);
    const nuevoEmail = prompt('Nuevo email', s.email);

    if (nuevoNombre && nuevoEmail){
      this.svc.update(s.id, { nombre: nuevoNombre, email: nuevoEmail })
        .subscribe(()=> this.load());
    }
  }

  remove(id:number){
    if (confirm('¿Eliminar estudiante?')){
      this.svc.delete(id).subscribe(()=> this.load());
    }
  }
}
