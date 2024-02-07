import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClassService } from 'src/app/services/class.service';
import { CourseService } from 'src/app/services/course.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-teachers-tab',
  templateUrl: './teachers-tab.component.html',
  styleUrls: ['./teachers-tab.component.css']
})
export class TeachersTabComponent implements OnInit {
  teacher:any={};
  teachers:any=[];
  teacherId:any;
  id:any;
  course:any={};
  courseId:any;
  coursesId: any=[];
  coursesList:any=[];
  classes:any=[];
  class:any={};
  classId:any=[];

  constructor(private router: Router, private userService: UserService,private courService : CourseService,
  private classService : ClassService) { }

ngOnInit() {
  this.refreshTable();
      //Get all classes for select To affect Student
  this.classService.getAllClasses().subscribe(
    (success) => {
      console.log("Here success",success);
      this.classes = success.classesTab;
    },
    (err) => {
      console.log("Here error",err);
    });
}
  goToDispalyTeacher(id:number){
    this.router.navigate([`/teacherInfo/${id}`]);
  }
  goToEditTeacher(id:number){
    this.router.navigate([`/editProfileTeacher/${id}`]);
  }
  // affectTeacherToClass(id){
  //   this.router.navigate([`/affectTeacher/${id}`]);
  // }
  saveTeacherId(id){
    localStorage.setItem("teacherId", JSON.stringify(id));
    this.teacherId = JSON.parse(localStorage.getItem("teacherId")) // récuperer l'ID du teacher depuis LS
    this.userService.getUserCourses(this.teacherId,"teacher").subscribe(
      (success) => {
        console.log("Here success",success);
       this.coursesList = success.courses; 
      },
      (err) => {console.log("Here error",err);}
    );
  }
  affectTeacherToClass(){
    this.teacherId = JSON.parse(localStorage.getItem("teacherId")) // récuperer l'ID du teacher depuis LS
    const affectedTeacher ={
      teacherId : this.teacherId,
      classId:this.classId,
      courseId : this.coursesId,
      };
      this.userService.affectTeacherToClass(affectedTeacher).subscribe(
        (data)=>{
          console.log("here response ", data.msg);
          // this.router.navigate(["teachersTab"]);
      });
  }
  // Select Class and check class courses
  selectClass(evt) {
    console.log(" Here selected Class ID", evt.target.value);
    this.classId =evt.target.value;
  }
  // checkClass(evt:any, id: string) {
  //   console.log(" Here checked Classes ID", evt.target.value);
  //   if (evt.target.checked) {
  //     // Si la case à cocher est cochée, ajoutez l'ID à la liste des IDs sélectionnés
  //     // this.classId.push(id);
  //     this.classId=evt.target.value;
  //   } else {
  //     // Si la case à cocher est décochée, retirez l'ID de la liste des IDs sélectionnés
  //     const index = this.classId.indexOf(id);
  //     if (index !== -1) {
  //       this.classId.splice(index, 1);
  //     }
  //   }
  // }
  checkCourse(evt, id: string) {
    console.log(" Here checked Courses ID", evt.target.value);
    id = evt.target.value;
    const isChecked = evt.target.checked; // Récupérer l'état actuel de la case à cocher (cochée ou non).
    console.log(isChecked);
    //  Vérifier si la case est cochée et que l'ID n'existe pas déjà dans la liste coursesId
    if (isChecked && !this.coursesId.includes(id)) { 
      this.coursesId.push(id); // Ajouter l'ID
      console.log(this.coursesId);
    } 
    // Vérifier si la case est décochée et que l'ID est dans la liste coursesId
    else{ 
      this.coursesId = this.coursesId.filter(courseId => courseId !== id); // Retirer l'ID
      console.log(this.coursesId);
    }
  }
  validateTeacher(id){
    this.userService.updateTeacherStatus(id).subscribe(
    (success)=>{
      console.log("Here data after validation", success.msg);
      this.refreshTable();
    },
    (error) => {
      console.log("Here error", error);
    }); 
  }
  deleteTeacher(id:number){
      this.userService.deleteUserById(id).subscribe(
        (success) => {
          console.log("Here success",success.msg);
          this.refreshTable();
        },
        (err) => {console.log("Here error",err);}
      );
  }

  refreshTable(){
    this.userService.getAllUsers("teacher").subscribe(
      (success) => {
        console.log("Here success",success);
        this.teachers = success.response;
      },
      (err) => {
        console.log("Here error",err);
      }
    );
  }
}
