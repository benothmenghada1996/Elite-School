import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  classUrl:string="http://localhost:3000/classes"
  
  constructor(private httpClient:HttpClient) { }
  
  getAllClasses(){
    return this.httpClient.get<{ classesTab: any }>(this.classUrl);
  }
  addClass(obj){
    return this.httpClient.post<{ msg: string }>(this.classUrl,obj);
  }
  editClass(obj){
    return this.httpClient.put<{ msg: string }>(this.classUrl,obj) 
  }
  deleteClassById(id){
    return this.httpClient.delete<{ msg: string }>(`${this.classUrl}/${id}`);
  }
  getClassById(id){
    return this.httpClient.get<{ class: any }>(`${this.classUrl}/${id}`);
  }
  getUserClasses(id:any,role:string){
    return this.httpClient.get<{classesTab:any}>(`${this.classUrl}/${id}/${role}`);
  }
  getCoursesForStudents(id) {
    return this.httpClient.get<{coursesByStudent:any, msg:any}>(`${this.classUrl}/${id}/students/courses`);
  }
  getOneClassCourses(id){
    return this.httpClient.get<{courses:any}>(`${this.classUrl}/courses/${id}`);
  }
 

}
