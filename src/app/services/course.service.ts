import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  courseUrl:string="http://localhost:3000/courses"
  
  constructor(private httpClient:HttpClient) { }
  
  getAllCourses(){
    return this.httpClient.get<{ coursesTab: any }>(this.courseUrl);
  }
  addCourse(course:any, img:File){
    let formData =  new FormData();
    formData.append("img",img);
    formData.append("name",course.name);
    formData.append("description",course.description);
    formData.append("duration",course.duration);
    formData.append("teacherId",course.teacherId);
 
    return this.httpClient.post<{ msg: string }>(this.courseUrl,formData);
  }
  affectCourseToClass(obj) {
    return this.httpClient.put<{ msg: string }>(this.courseUrl + "/affectCourseToClass", obj);
  }
  editCourse(course:any, img:File){
    let formData =  new FormData();
    formData.append("img",img);
    formData.append("id",course._id);
    formData.append("name",course.name);
    formData.append("description",course.description);
    formData.append("duration",course.duration);

    return this.httpClient.put<{ msg: string }>(this.courseUrl,formData) 
  }
  deleteCourseById(id){
    return this.httpClient.delete<{ msg: string }>(`${this.courseUrl}/${id}`);
  }
  getCourseById(id){
    return this.httpClient.get<{ course: any }>(`${this.courseUrl}/${id}`);
  }
  getClassCourses(id){
    return this.httpClient.get<{courses:any}>(`${this.courseUrl}/class/${id}`);
  }
  searchCoursesBySonTel(obj){
    return this.httpClient.post<{ courses: string }>(this.courseUrl + "/searchBySonTel", obj);
  }




}
