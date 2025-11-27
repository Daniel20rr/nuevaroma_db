import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudentListComponent } from './student-list.component';
import { StudentFormComponent } from './student-form.component';
import { SubjectListComponent } from './subject-list.component';
import { SubjectFormComponent } from './subject-form.component';
import { GradeListComponent } from './grade-list.component';
import { GradeFormComponent } from './grade-form.component';

import { ExcelImportComponent } from './modules/excel/components/excel-import/excel-import.component';

// ⭐ CORRECCIÓN: Rutas de importación planas, sin './professor/'
import { ProfessorListComponent } from './professor-list.component';
import { ProfessorFormComponent } from './professor-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'students', pathMatch: 'full' },

  { path: 'students', component: StudentListComponent },
  { path: 'students/new', component: StudentFormComponent },

  { path: 'subjects', component: SubjectListComponent },
  { path: 'subjects/new', component: SubjectFormComponent },

  { path: 'grades', component: GradeListComponent },
  { path: 'grades/new', component: GradeFormComponent },

  { path: 'excel', component: ExcelImportComponent },

  // ⭐ CRUD PROFESORES
  { path: 'profesores', component: ProfessorListComponent },
  { path: 'profesores/new', component: ProfessorFormComponent },
  { path: 'profesores/edit/:id', component: ProfessorFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}