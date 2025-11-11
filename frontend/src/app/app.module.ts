import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { StudentListComponent } from './student-list.component';
import { StudentFormComponent } from './student-form.component';
import { SubjectListComponent } from './subject-list.component';
import { SubjectFormComponent } from './subject-form.component';
import { GradeListComponent } from './grade-list.component';
import { GradeFormComponent } from './grade-form.component';

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
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
