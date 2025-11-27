import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router'; // ⬅️ ¡AGREGADO para router-outlet y rutas!

import { AppComponent } from './app.component';

// Componentes existentes
import { StudentListComponent } from './student-list.component';
import { StudentFormComponent } from './student-form.component';
import { SubjectListComponent } from './subject-list.component';
import { SubjectFormComponent } from './subject-form.component';
import { GradeListComponent } from './grade-list.component';
import { GradeFormComponent } from './grade-form.component';

// Paginación
import { NgxPaginationModule } from 'ngx-pagination';

// Rutas principales
import { AppRoutingModule } from './app-routing.module';

// Excel Module
import { ExcelModule } from './modules/excel/excel.module';

// Chart.js
import { Chart, registerables } from 'chart.js';

// ⭐ IMPORTACIONES CORREGIDAS: Si los componentes son vecinos de app.module.ts
import { ProfessorListComponent } from './professor-list.component'; // ⬅️ RUTA CORREGIDA (Elimina la subcarpeta 'professor/')
import { ProfessorFormComponent } from './professor-form.component'; // ⬅️ RUTA CORREGIDA (Elimina la subcarpeta 'professor/')

Chart.register(...registerables);

@NgModule({
  declarations: [
    AppComponent,
    StudentListComponent,
    StudentFormComponent,
    SubjectListComponent,
    SubjectFormComponent,
    GradeListComponent,
    GradeFormComponent,
    ProfessorListComponent,
    ProfessorFormComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule,
    RouterModule, // ⬅️ ¡AGREGADO! Soluciona error 'router-outlet' (NG8001)
    AppRoutingModule, // (Contiene las rutas)
    ExcelModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}