import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API = 'http://localhost:8000';

@Injectable({providedIn:'root'})
export class StudentService {
  constructor(private http: HttpClient){}

  list(q?: string): Observable<any> {
    let url = API + '/students/';
    if (q) url += '?q=' + encodeURIComponent(q);
    return this.http.get(url);
  }

  create(data:any){
    return this.http.post(API + '/students/', data);
  }

  update(id:number, data:any){
    return this.http.put(API + '/students/' + id, data);
  }

  delete(id:number){
    return this.http.delete(API + '/students/' + id);
  }
}
