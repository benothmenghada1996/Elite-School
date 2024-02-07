import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  noteEvaluationUrl:string = "http://localhost:3000/noteEvaluations";

  constructor(private httpClient:HttpClient) { }

  addEvaluation(obj){
    return this.httpClient.post<{msg:string}>(this.noteEvaluationUrl,obj);
  }
  getStudentEvaluation(obj){
    return this.httpClient.post<{NoteEvaluat:any}>(this.noteEvaluationUrl+"/student",obj)
  }
  // getStudentEvaluation(studentId:any, courseId:any){
  //   return this.httpClient.get<{NoteEvaluat:any}>(`${this.noteEvaluationUrl}/student/${studentId}/${courseId}`)
  // }
}
