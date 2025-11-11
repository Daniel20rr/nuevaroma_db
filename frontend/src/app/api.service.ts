import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API = 'http://localhost:8000';

@Injectable({providedIn:'root'})
export class ApiService {
  constructor(private http: HttpClient){}

  // Students
  listStudents(q?: string): Observable<any> {
    let url = API + '/students/';
    if (q) url += '?q=' + encodeURIComponent(q);
    return this.http.get(url);
  }
  createStudent(data:any){ return this.http.post(API + '/students/', data); }
  updateStudent(id:number, data:any){ return this.http.put(API + '/students/' + id, data); }
  deleteStudent(id:number){ return this.http.delete(API + '/students/' + id); }
  getStudent(id:number){ return this.http.get(API + '/students/' + id); }

  // Subjects
  listSubjects(){ return this.http.get(API + '/subjects/'); }
  createSubject(data:any){ return this.http.post(API + '/subjects/', data); }

  // Grades
  listGrades(student_id?: number){ 
    let url = API + '/grades/';
    if (student_id) url += '?student_id=' + student_id;
    return this.http.get(url);
  }
  createGrade(data:any){ return this.http.post(API + '/grades/', data); }
}
