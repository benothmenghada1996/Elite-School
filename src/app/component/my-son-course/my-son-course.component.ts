import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';
import jwt_decode from "jwt-decode";
import { UserService } from 'src/app/services/user.service';
import { ClassService } from 'src/app/services/class.service';
import { EvaluationService } from 'src/app/services/evaluation.service';


@Component({
  selector: 'app-my-son-course',
  templateUrl: './my-son-course.component.html',
  styleUrls: ['./my-son-course.component.css']
})
export class MySonCourseComponent implements OnInit {
  searchForm:FormGroup;
  courses: any=[] ;
  course:any={};
  courseId:string;
  class:any={};
  user:any={};
  mySon:any={};
  teacher:any={};
  note:any={};
  isFound :boolean=true;

  constructor(private router: Router,  private userService : UserService,
     private evaluationService:EvaluationService , private classService: ClassService, private courseService: CourseService) { }

  ngOnInit() {

  }

search(){
  const jwt = sessionStorage.getItem("token");
  this.user=this.decodeToken(jwt);

  this.userService.getStudentByTel(this.user.sonTel).subscribe((data) => {
    this.mySon = data.mySon;

    this.userService.getUserCourses(this.mySon[0]._id,"student").subscribe((coursesData) => {
      console.log("Here data", coursesData.courses);
      this.courses = coursesData.courses;
      this.isFound = coursesData.courses.length > 0;

      // Get evaluations and notes for each course
      this.courses.forEach((course) => {
        this.evaluationService.getStudentEvaluation({
          studentId: this.mySon[0]._id,
          courseId: course._id,
        }).subscribe(
          (evaluationData) => {
            console.log("Here Student Mark And Evaluation", evaluationData.NoteEvaluat);
            course.evaluation = evaluationData.NoteEvaluat[0]; // Assuming there's only one evaluation per course
          },(error) => {
            console.log('Here error', error);
          }
        );

        // Get teacher for each course
        this.userService.getCourseTeacher(course._id).subscribe(
          (teacherData) => {
            console.log("Here data", teacherData.teacher);
            course.teacher = teacherData.teacher;
            console.log(course.teacher);
          }
        );
      });
      this.classService.getUserClasses(this.mySon[0]._id,"student").subscribe(
        (data) => {
          console.log("Here data",data.classesTab);
          this.class = data.classesTab;
        },
      );
    });
  });
}   

displayCourse(id){
  this.router.navigate([`/mySoncourseInfo/${id}`]);
}

decodeToken(token: string) {
  return jwt_decode(token);
} 

noteResult(a:number){
  if(a<10){return 'red'}
  else if(a>10 && a<13){return 'orangered'}
  else if(a>=13 && a<15){return 'yellow'}
  else if(a>=15 && a<18){return 'blue'}
  else if(a>=18 && a<=20){return 'green'}
}
evalResult(ch:string){
  if(ch==="Low"){return 'red'}
  else if(ch==="Satisfactory"){return 'orangered'}
  else if(ch==="Good"){return 'yellow'}
  else if(ch==="Very Good"){return 'blue'}
  else if(ch==="Excellent"){return 'green'}
}
}
  
  


