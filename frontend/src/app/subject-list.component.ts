import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-subject-list',
  template: `
  <div class="card mt-3">
    <div class="card-body">
      <div class="d-flex mb-2">
        <div class="me-auto"><h5>Materias</h5></div>
        <div><button class="btn btn-sm btn-primary" (click)="load()">Refrescar</button></div>
      </div>
      <table class="table table-striped">
        <thead><tr><th>Id</th><th>Nombre</th></tr></thead>
        <tbody>
          <tr *ngFor="let s of subjects">
            <td>{{s.id}}</td><td>{{s.name}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  `
})
export class SubjectListComponent implements OnInit {
  subjects:any[] = [];
  constructor(private svc: ApiService){}
  ngOnInit(){ this.load(); }
  load(){ this.svc.listSubjects().subscribe((r:any)=> this.subjects = r); }
}
