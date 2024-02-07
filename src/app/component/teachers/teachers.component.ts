import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})
export class TeachersComponent implements OnInit {
  teachers:any=[];
  constructor(private userService:UserService) { }
  ngOnInit() {
    // this.userService.getAllTeachers().subscribe(
    //   (success) => {
    //     console.log("Here success",success);
    //     this.teachers = success.teachers;
    //   },
    //   (err) => {
    //     console.log("Here error",err);
    //   }
    // );
    this.userService.getAllUsers("teacher").subscribe(
      (success) => {
        console.log("Here success",success.response);
        this.teachers = success.response;
        console.log(this.teachers);
        
      },
      (err) => {
        console.log("Here error",err);
      }
    );
  }
}
