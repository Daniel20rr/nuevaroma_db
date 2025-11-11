import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-grade-list',
  template: `
  <div class="card mt-3">
    <div class="card-body">
      <h5>Notas</h5>
      <table class="table table-sm">
        <thead><tr><th>Id</th><th>Alumno</th><th>Materia</th><th>Nota</th></tr></thead>
        <tbody>
          <tr *ngFor="let g of grades">
            <td>{{g.id}}</td>
            <td>{{g.student?.name}}</td>
            <td>{{g.subject?.name}}</td>
            <td>{{g.grade}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  `
})
export class GradeListComponent implements OnInit {
  grades:any[] = [];
  constructor(private svc: ApiService){}
  ngOnInit(){ this.load(); }
  load(){ this.svc.listGrades().subscribe((r:any)=> this.grades = r); }
}
