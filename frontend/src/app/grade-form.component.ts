import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-grade-form',
  template: `
  <div class="card p-3 mt-3">
    <div class="row g-2">
      <div class="col-md-4">
        <select class="form-select" [(ngModel)]="student_id">
          <option [value]="" disabled>Seleccionar alumno</option>
          <option *ngFor="let s of students" [value]="s.id">{{s.name}}</option>
        </select>
      </div>
      <div class="col-md-4">
        <select class="form-select" [(ngModel)]="subject_id">
          <option [value]="" disabled>Seleccionar materia</option>
          <option *ngFor="let s of subjects" [value]="s.id">{{s.name}}</option>
        </select>
      </div>
      <div class="col-md-2"><input class="form-control" type="number" step="0.1" [(ngModel)]="grade" placeholder="Nota" /></div>
      <div class="col-md-2"><button class="btn btn-success" (click)="create()">Agregar Nota</button></div>
    </div>
  </div>
  `
})
export class GradeFormComponent implements OnInit {
  students:any[]=[]; subjects:any[]=[];
  student_id:number|null=null; subject_id:number|null=null; grade:number|null=null;
  constructor(private svc: ApiService){}
  ngOnInit(){
    this.svc.listStudents().subscribe((r:any)=> this.students = r);
    this.svc.listSubjects().subscribe((r:any)=> this.subjects = r);
  }
  create(){
    if (!this.student_id || !this.subject_id || this.grade==null){ alert('Completar campos'); return; }
    this.svc.createGrade({student_id:this.student_id, subject_id:this.subject_id, grade:this.grade}).subscribe(()=>{ alert('Nota agregada'); this.grade=null; }, err=> alert('Error'));
  }
}
