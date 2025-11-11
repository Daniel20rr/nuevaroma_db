import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <div class="container mt-4">
    <h1>CRUD Nuevaroma</h1>
    <ul class="nav nav-tabs mt-3">
      <li class="nav-item"><a class="nav-link" [class.active]="tab==='students'" (click)="tab='students'">Alumnos</a></li>
      <li class="nav-item"><a class="nav-link" [class.active]="tab==='subjects'" (click)="tab='subjects'">Materias</a></li>
      <li class="nav-item"><a class="nav-link" [class.active]="tab==='grades'" (click)="tab='grades'">Notas</a></li>
    </ul>

    <div class="mt-3" *ngIf="tab==='students'">
      <app-student-form (refresh)="onRefresh()"></app-student-form>
      <app-student-list></app-student-list>
    </div>

    <div *ngIf="tab==='subjects'">
      <app-subject-form></app-subject-form>
      <app-subject-list></app-subject-list>
    </div>

    <div *ngIf="tab==='grades'">
      <app-grade-form></app-grade-form>
      <app-grade-list></app-grade-list>
    </div>
  </div>
  `
})
export class AppComponent {
  tab = 'students';
  onRefresh(){ window.location.reload(); }
}
