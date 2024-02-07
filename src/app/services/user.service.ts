import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userUrl: string = "http://localhost:3000/users";
  
  constructor(private httpClient:HttpClient) { }

  signUp(user:any, fileType:string) {
    let formData =  new FormData();
    if (fileType === 'image') {
      formData.append("fileType", user.img);
    } else if (fileType === 'pdf') {
      formData.append("fileType", user.pdf);
    }
    formData.append("firstName",user.firstName);
    formData.append("lastName",user.lastName);
    formData.append("email",user.email);
    formData.append("adress",user.adress);
    formData.append("tel",user.tel);
    formData.append("pwd",user.pwd);
    formData.append("speciality",user.speciality);
    formData.append("sonTel",user.sonTel);
    formData.append("role",user.role);
    return this.httpClient.post<{ msg: string }>(this.userUrl + "/signup", formData);
  }
   // obj = { tel:valeur , pwd:valeur}
  login(user) {
    return this.httpClient.post<{msg: string; token: string}>(this.userUrl + "/login",user);
  }
  getAllUsers(role:string){
    return this.httpClient.get<{response:any}>(`${this.userUrl}/${role}`);
  }
  getUserById(id){
    return this.httpClient.get<{ findedUser: any }>(`${this.userUrl}/user/${id}`);
  }
  updateTeacherStatus(id){
    return this.httpClient.get<{ msg: string }>(`${this.userUrl}/updateStatus/${id}`);
  }
  editProfile(user:any, fileType:string) {
    let formData =  new FormData();
    if (fileType === 'image') {
      formData.append("fileType", user.img);
    } else if (fileType === 'pdf') {
      formData.append("fileType", user.pdf);
    }
    formData.append("email",user.email);
    formData.append("pwd",user.pwd);
    formData.append("tel",user.tel);
    formData.append("adress",user.adress);
    formData.append("speciality",user.speciality);
    formData.append("sonTel",user.sonTel);
    formData.append("role",user.role);
    formData.append("id",user.id);
    return this.httpClient.put<{msg:string}>(this.userUrl + "/editProfile",formData);
  }
  deleteUserById(id) {
    return this.httpClient.delete<{msg:string}>(`${this.userUrl}/${id}`);
  }
  affectStudentToClass(obj) {
    return this.httpClient.put<{ msg: string }>(this.userUrl + "/affectToClass", obj);
  }
  affectTeacherToClass(obj) {
    return this.httpClient.put<{ msg: string }>(this.userUrl + "/affectTeacherToClass", obj);
  }
  getStudentByTel(id){
    return this.httpClient.get<{mySon:any}>(`${this.userUrl}/student/${id}`);
  }
  getUserCourses(id:any,role:string){
    return this.httpClient.get<{courses:any}>(`${this.userUrl}/${id}/${role}/courses`);
  }
  getStudentsForCourseOrClass(id:any,type:string){
    return this.httpClient.get<{students:any}>(`${this.userUrl}/students/${type}/${id}`);
  }
  getCourseTeacher(id){
    return this.httpClient.get<{teacher:any}>(`${this.userUrl}/teacher/${id}`);
  }
  getTeacherBySpeciality(obj){
    return this.httpClient.post<{ teachers: string }>(this.userUrl + "/searchTeacher", obj);
  }
  getTemperature() {
    return this.httpClient.get<{response:any}>(this.userUrl+"/weather/city");
  }
  getCityTime() {
    return this.httpClient.get<{result:any}>(this.userUrl+"/time/city");
  }

 
}
