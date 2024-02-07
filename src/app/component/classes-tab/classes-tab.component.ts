import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClassService } from 'src/app/services/class.service';
import jwt_decode from "jwt-decode";


@Component({
  selector: 'app-classes-tab',
  templateUrl: './classes-tab.component.html',
  styleUrls: ['./classes-tab.component.css']
})
export class ClassesTabComponent implements OnInit {
  class:any={};
  classes:any=[];
  user:any={};

  constructor(private router: Router, private classService : ClassService) { }

  ngOnInit() {
    this.refreshTable();
  }
  goToDispalyClass(id){
    this.router.navigate([`/studentClassList/${id}`]);
  }
  goToEditClass(id){
    this.router.navigate([`/editClass/${id}`]);
  }
  deleteClass(id){
    this.classService.deleteClassById(id).subscribe(
      (success) => {
        console.log("Here success",success.msg);
        this.refreshTable();
      },
      (err) => {console.log("Here error",err);}
    );
  }

  refreshTable(){
    const jwt = sessionStorage.getItem("token");
    this.user=this.decodeToken(jwt);
    console.log(this.user);
    
  if (this.user.role === 'admin') {
    this.classService.getAllClasses().subscribe(
      (success) => {
        console.log("Here success",success);
        this.classes = success.classesTab;
      },
      (err) => {
        console.log("Here error",err);
      }
    );
  }
  else if (this.user.role === 'teacher') {
    // this.classService.getTeacherClasses(this.user.id).subscribe(
    //   (success) => {
    //     console.log("Here success",success);
    //     this.classes = success.classesTab;
    //   },
    //   (err) => {
    //     console.log("Here error",err);
    //   }
    // );
    this.classService.getUserClasses(this.user.id,"teacher").subscribe(
      (success) => {
        console.log("Here success",success);
        this.classes = success.classesTab;
      },
      (err) => {
        console.log("Here error",err);
      }
    );
  }
  }
  decodeToken(token: string) {
    return jwt_decode(token);
   } 
}
