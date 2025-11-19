import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

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

// 👉 IMPORTACIÓN DEL NUEVO MÓDULO EXCEL
import { ExcelModule } from './modules/excel/excel.module';

// 🔥 IMPORTACIÓN Y REGISTRO DE CHART.JS (REQUERIDO PARA ANGULAR 15)
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@NgModule({
  declarations: [
    AppComponent,
    StudentListComponent,
    StudentFormComponent,
    SubjectListComponent,
    SubjectFormComponent,
    GradeListComponent,
    GradeFormComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule,
    AppRoutingModule,
    ExcelModule   // 👉 integrar el módulo excel aquí
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}