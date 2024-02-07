import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';
import { UserService } from 'src/app/services/user.service';
import jwt_decode from 'jwt-decode';
import { EvaluationService } from 'src/app/services/evaluation.service';

@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.css']
})
export class CourseInfoComponent implements OnInit {
  course:any={};
  courseId:string;
  teacher:any={};
  role : string;
  user:any;
  note:any={};
  notesTab:any={};

  constructor(private courseService:CourseService, private userService:UserService, private activatedRoute:ActivatedRoute, 
    private evaluationService:EvaluationService) { }

  ngOnInit() {
    this.isLoggedIn()
    const jwt = sessionStorage.getItem("token");
    this.user=this.decodeToken(jwt);
    this.courseId=this.activatedRoute.snapshot.paramMap.get("id"); // récuperer l'ID du cours depuis l'URL
    this.courseService.getCourseById(this.courseId).subscribe(
      (data) => {
        console.log('Here data', data.course);
        this.course = data.course;

        this.userService.getCourseTeacher(this.course._id).subscribe(
          (data) => {
            console.log("Here data",data.teacher);
            this.teacher = data.teacher;
            console.log(this.teacher); 
        });
      },
      (err) => {
        console.log('Here error', err);
      }
    );
    
    this.evaluationService.getStudentEvaluation({ studentId: this.user.id, courseId: this.courseId }).subscribe(
      (data) => {
        console.log("Here Student Mark And Evaluation",data.NoteEvaluat);
        this.note = data.NoteEvaluat[0];
      });
  }

  isLoggedIn(){
    const jwt = sessionStorage.getItem("token");
    if (jwt) {
      this.user =this.decodeToken(jwt);
      console.log(this.user);
      this.role= this.user.role; 
    }
    return !!jwt
    }
    decodeToken(token: string) {
      return jwt_decode(token);
    } 
    noteResult(a:number){
      if(a<10){return 'red'}
      else if(a>10 && a<13){return 'orangered'}
      else if(a>=13 && a<15){return 'yellow'}
      else if(a>=15 && a<=18){return 'greenyellow'}
      else if(a>18 && a<=20){return 'green'}
    }
    evalResult(ch:string){
      if(ch==="Low"){return 'red'}
      else if(ch==="Satisfactory"){return 'orangered'}
      else if(ch==="Good"){return 'yellow'}
      else if(ch==="Very Good"){return 'greenyellow'}
      else if(ch==="Excellent"){return 'green'}
    }


}
