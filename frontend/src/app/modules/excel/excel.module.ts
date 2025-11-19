import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// 📌 Importante para usar gráficos ng2-charts
import { NgChartsModule } from 'ng2-charts';

// 📌 Componente principal
import { ExcelImportComponent } from './components/excel-import/excel-import.component';

// 📌 Servicio API (para consumir FastAPI - estudiantes, materias, notas y stats)
import { ApiService } from '../../api.service';

@NgModule({
  declarations: [
    ExcelImportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgChartsModule, // ✅ Ya incluido - perfecto para ng2-charts
    RouterModule.forChild([
      { path: '', component: ExcelImportComponent }
    ])
  ],
  providers: [
    ApiService // ✅ Ya incluido - necesario para estadísticas desde FastAPI
  ],
  exports: [
    ExcelImportComponent
  ]
})
export class ExcelModule {}