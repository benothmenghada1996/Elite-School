
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import jwt_decode from "jwt-decode";
import { ClassService } from 'src/app/services/class.service';

@Component({
  selector: 'app-student-class-list',
  templateUrl: './student-class-list.component.html',
  styleUrls: ['./student-class-list.component.css']
})
export class StudentClassListComponent implements OnInit {
  student:any={};
  students:any=[];
  id:any;
  user:any;
  classId:any;
  class:any={};

  constructor(private router: Router,private userService: UserService, private classService:ClassService,  
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    const jwt = sessionStorage.getItem("token");
    this.user=this.decodeToken(jwt);
    this.classId=this.activatedRoute.snapshot.paramMap.get("id"); // récuperer l'ID du class depuis l'URL
    this.classService.getClassById(this.classId).subscribe(
      (classData) => {
        console.log("Here course data", classData.class);
        this.class = classData.class;
        
        this.userService.getStudentsForCourseOrClass(this.class._id,"class").subscribe(
          (studentsData) => {
            console.log("Here students data", studentsData.students);
            this.students = studentsData.students;
          },
          (studentsError) => {
            console.error("Error fetching students:", studentsError);
          }
        ); 
      },
      (error) => {
        console.error("Error fetching class:", error);
      }
    );
 
  }

  decodeToken(token: string) {
    return jwt_decode(token);
  } 

}
