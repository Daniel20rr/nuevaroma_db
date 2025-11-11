import { Component, OnInit } from '@angular/core';
import { StudentService } from './student.service';

@Component({
  selector: 'app-student-list',
  template: `
  <div class="card mt-3">
    <div class="card-body">
      <div class="row mb-2">
        <div class="col">
          <input class="form-control" placeholder="Buscar por nombre o email" [(ngModel)]="query" (input)="search()" />
        </div>
        <div class="col-auto">
          <button class="btn btn-secondary" (click)="load()">Refrescar</button>
        </div>
      </div>
      <table class="table table-striped">
        <thead><tr><th>Id</th><th>Nombre</th><th>Email</th><th>Acciones</th></tr></thead>
        <tbody>
          <tr *ngFor="let s of students">
            <td>{{s.id}}</td>
            <td>{{s.name}}</td>
            <td>{{s.email}}</td>
            <td>
              <button class="btn btn-sm btn-primary me-1" (click)="edit(s)">Editar</button>
              <button class="btn btn-sm btn-danger" (click)="remove(s.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  `
})
export class StudentListComponent implements OnInit {
  students:any[] = [];
  query:string = '';

  constructor(private svc: StudentService){}

  ngOnInit(){ this.load(); }

  load(){ this.svc.list().subscribe((r:any)=> this.students = r); }

  search(){ this.svc.list(this.query).subscribe((r:any)=> this.students = r); }

  edit(s:any){
    const name = prompt('Nuevo nombre', s.name);
    if (name !== null){
      this.svc.update(s.id, {name}).subscribe(()=> this.load());
    }
  }

  remove(id:number){
    if (confirm('Eliminar?')){
      this.svc.delete(id).subscribe(()=> this.load());
    }
  }
}
