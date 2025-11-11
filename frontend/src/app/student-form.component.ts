import { Component, Output, EventEmitter } from '@angular/core';
import { StudentService } from './student.service';

@Component({
  selector: 'app-student-form',
  template: `
  <div class="card p-3">
    <div class="row">
      <div class="col">
        <input class="form-control" placeholder="Nombre" [(ngModel)]="name" />
      </div>
      <div class="col">
        <input class="form-control" placeholder="Email" [(ngModel)]="email" />
      </div>
      <div class="col-auto">
        <button class="btn btn-success" (click)="create()">Agregar</button>
      </div>
    </div>
  </div>
  `
})
export class StudentFormComponent {
  name = '';
  email = '';
  @Output() refresh = new EventEmitter<void>();
  constructor(private svc: StudentService){}

  create(){
    if (!this.name) { alert('Nombre requerido'); return; }
    this.svc.create({name:this.name, email:this.email}).subscribe(()=>{
      this.name=''; this.email='';
      this.refresh.emit();
      window.location.reload();
    }, err=> alert('Error'));
  }
}
