import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudentListComponent } from './student-list.component';
import { StudentFormComponent } from './student-form.component';
import { SubjectListComponent } from './subject-list.component';
import { SubjectFormComponent } from './subject-form.component';
import { GradeListComponent } from './grade-list.component';
import { GradeFormComponent } from './grade-form.component';

import { ExcelImportComponent } from './modules/excel/components/excel-import/excel-import.component';

const routes: Routes = [
  { path: '', redirectTo: 'students', pathMatch: 'full' },

  { path: 'students', component: StudentListComponent },
  { path: 'students/new', component: StudentFormComponent },

  { path: 'subjects', component: SubjectListComponent },
  { path: 'subjects/new', component: SubjectFormComponent },

  { path: 'grades', component: GradeListComponent },
  { path: 'grades/new', component: GradeFormComponent },

  // 👉 RUTA CORRECTA PARA EL EXCEL
  { path: 'excel', component: ExcelImportComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
