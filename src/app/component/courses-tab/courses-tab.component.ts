import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';
import { UserService } from 'src/app/services/user.service';
import jwt_decode from "jwt-decode";
import { forkJoin } from 'rxjs';
import { ClassService } from 'src/app/services/class.service';

@Component({
  selector: 'app-courses-tab',
  templateUrl: './courses-tab.component.html',
  styleUrls: ['./courses-tab.component.css']
})
export class CoursesTabComponent implements OnInit {
  course:any={};
  courses:any=[];
  class:any={};
  teacher:any={};
  user:any={};

  constructor(private router: Router, private courseService: CourseService, private userService:UserService,
    private classService: ClassService) { }

  ngOnInit() {
    this.refreshCoursesTab();
  }

  goToDispalyCourse(id){
    this.router.navigate([`/courseInfo/${id}`]);
  }
  affectCourseToClass(id){
    this.router.navigate([`/affectCourse/${id}`]);
  }
  goToEditCourse(id){
    this.router.navigate([`/editCourse/${id}`]);
  }
  deleteCourse(id){
    this.courseService.deleteCourseById(id).subscribe(
      (success) => {
        console.log("Here success",success.msg);
        this.refreshCoursesTab();
      },
      (err) => {console.log("Here error",err);}
    );
  }
  goToDispalyStudents(id){
    // localStorage.setItem("courseId", JSON.stringify(id));
    this.router.navigate([`/teacherStudentsTab/${id}`]);
  }

  decodeToken(token: string) {
    return jwt_decode(token);
   } 

refreshCoursesTab(){
  const jwt = sessionStorage.getItem("token");
  this.user=this.decodeToken(jwt);
  console.log(this.user);

  if (this.user.role === 'admin') {
    this.courseService.getAllCourses().subscribe(
      (success) => {
        console.log("Here success", success.coursesTab);
        this.courses = success.coursesTab;
        const courseTeacher = this.courses.map((course) => {
          return this.userService.getCourseTeacher(course._id);
        });
        forkJoin(courseTeacher).subscribe(
          (teacherData: any) => {
            teacherData.forEach((data: any, index: number) => {
              console.log("Here data", data.teacher);
              this.courses[index].teacher= data.teacher;
            });
            console.log(this.courses); 
          },
          (err) => {
            console.log("Error fetching teacher data", err);
          });
      },
      (err) => {
        console.log("Error fetching courses", err);
      }
    ); 
  }
  if (this.user.role === 'teacher' || this.user.role === 'student') {
    this.userService.getUserCourses(this.user.id, this.user.role).subscribe(
      (data) => {
        console.log("Here data", data.courses);
        this.courses = data.courses;
      },
    );
  
    if (this.user.role === 'student') {
      this.classService.getUserClasses(this.user.id, "student").subscribe(
        (data) => {
          console.log("Here data", data.classesTab);
          this.class = data.classesTab;
        },
      );
    }
  }
}
}


