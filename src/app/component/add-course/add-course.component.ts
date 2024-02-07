import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import jwt_decode from "jwt-decode";
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent implements OnInit {
  addCourseForm:FormGroup;
  imagePreview:any;
  user:any={};
  course:any={};
  courseId: any;
  title:string="Add Course";

  constructor( private router:Router, private activatedRoute : ActivatedRoute, private courseService:CourseService) { }

  ngOnInit() {
    const jwt = sessionStorage.getItem("token");
    this.user=this.decodeToken(jwt);
    this.courseId=this.activatedRoute.snapshot.paramMap.get("id");
    if (this.courseId){
     this.title="Edit Course"
     this.courseService.getCourseById(this.courseId).subscribe(
         (data) => {
           console.log("Here success",data);
           this.course = data.course;
         },
         (err) => {console.log("Here error",err);}
        );
    } 
  }
addOrEditCourse(){
  if (this.courseId){
    this.courseService.editCourse(this.course,this.course.img).subscribe(
      (success) => {console.log("Here success",success);
        if (this.user.role=="admin") {
          this.router.navigate(["admin"]);
        } 
        else if( this.user.role=="teacher") {
          this.router.navigate(["teacherDashboard"]);
        }
      },
      (err) => {console.log("Here error",err);
    });
  }else{
    this.course.teacherId = this.user.id;
    console.log(this.course);
    this.courseService.addCourse(this.course,this.course.img).subscribe((success) => {
      console.log("Here success",success.msg);
      // location.reload();
      this.router.navigate(["coursesTab"]);
      console.log(this.course);
    },
    // (err) => {console.log("Here error",err);}
    );
  }
}
decodeToken(token: string) {
  return jwt_decode(token);
} 
onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview  = e.target.result;
        this.course.img = file;
      };
      reader.readAsDataURL(file);
    }
  }

}
