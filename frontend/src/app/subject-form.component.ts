import { Component } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-subject-form',
  template: `
  <div class="card p-3 mt-3">
    <div class="row">
      <div class="col"><input class="form-control" placeholder="Nombre materia" [(ngModel)]="name" /></div>
      <div class="col-auto"><button class="btn btn-success" (click)="create()">Agregar</button></div>
    </div>
  </div>
  `
})
export class SubjectFormComponent {
  name = '';
  constructor(private svc: ApiService){}
  create(){
    if (!this.name) { alert('Nombre requerido'); return; }
    this.svc.createSubject({name:this.name}).subscribe(()=>{ this.name=''; alert('Creada'); }, err=> alert('Error creando')); 
  }
}
