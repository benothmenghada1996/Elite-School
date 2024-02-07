import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import jwt_decode from "jwt-decode";
import { CourseService } from 'src/app/services/course.service';
import { ClassService } from 'src/app/services/class.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EvaluationService } from 'src/app/services/evaluation.service';

@Component({
  selector: 'app-students-tab',
  templateUrl: './students-tab.component.html',
  styleUrls: ['./students-tab.component.css']
})
export class StudentsTabComponent implements OnInit {
  user:any={};
  student:any={};
  students:any=[];
  studentId:any;
  id:any;
  course:any={};
  courseId:any;
  coursesId: any=[];
  coursesList:any=[];
  classes:any=[];
  class:any={};
  classId:any;
  addNoteForm:FormGroup;


  constructor(private router: Router, private userService: UserService, private courseService: CourseService ,
  private classService : ClassService,private courService : CourseService, private activatedRoute: ActivatedRoute, 
  private formBuilder:FormBuilder,private evaluationService: EvaluationService) { }

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
  //Evaluating Student
  this.addNoteForm = this.formBuilder.group({
    note: [''], // Propriété pour la note
    evaluation: [''], // Propriété pour l'évaluation
  });
}
goToDispalyStudent(id){
  this.router.navigate([`/studentInfo/${id}`]);
}
goToEditStudent(id:number){
  this.router.navigate([`/editProfileStudent/${id}`]);
}
deleteStudent(id){
  this.userService.deleteUserById(id).subscribe(
    (success) => {
      console.log("Here success",success.msg);
      this.refreshTable();
    },
    (err) => {console.log("Here error",err);}
  );
}
saveStudentId(id){
  localStorage.setItem("studentId", JSON.stringify(id));
}
affectStudentToClass(){
  this.studentId = JSON.parse(localStorage.getItem("studentId")) // récuperer l'ID du student depuis LS
  const affectedStudent ={
  studentId : this.studentId,
  classId:this.classId,
  courseId :this.coursesId,
  };
  this.userService.affectStudentToClass(affectedStudent).subscribe(
    (data)=>{
      console.log("here response ", data.msg);
      this.router.navigate(["admin"]);
    })
}
//Select Class and check class courses
selectClass(evt) {
  console.log(" Here selected Class ID", evt.target.value);
  this.classId =evt.target.value;
  this.courService.getClassCourses(this.classId).subscribe(
    (success) => {
      console.log("Here success",success);
     this.coursesList = success.courses; 
    },
    (err) => {console.log("Here error",err);}
  );
}
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
evaluate(id:any){
  localStorage.setItem("evaluateStudentId", JSON.stringify(id));
}
addEvaluationNote(){
  this.courseId=this.activatedRoute.snapshot.paramMap.get("id"); // récuperer l'ID du cours depuis l'URL
  this.studentId=JSON.parse(localStorage.getItem("evaluateStudentId")) // récuperer l'ID du student à évaluer depuis LS
  // Récupération des valeurs du formulaire
  const formValue = this.addNoteForm.value;
  // Création de l'objet à envoyer au service
  const evaluatedStudent = {
    note: formValue.note, 
    evaluation: formValue.evaluation, 
    courseId: this.courseId,
    teacherId: this.user.id,
    studentId: this.studentId
  };
    this.evaluationService.addEvaluation(evaluatedStudent).subscribe(
      (data)=>{
        console.log("here response ", data.msg);
      })
}
refreshTable(){
  const jwt = sessionStorage.getItem("token");
  this.user=this.decodeToken(jwt);
  console.log(this.user);
  this.courseId=this.activatedRoute.snapshot.paramMap.get("id");
    if (this.user.role === 'admin') {
      this.userService.getAllUsers("student").subscribe(
        (success) => {
          console.log("Here success",success);
          this.students = success.response;
        },
        (err) => {
          console.log("Here error",err);
        }
      );
    }
    else if (this.user.role === 'teacher' && this.courseId) {
      //  récupérer d'abord le cours avant de chercher les étudiants associés.
      this.courseService.getCourseById(this.courseId).subscribe((data)=>{
        console.log("Here course data",data.course);
        this.course = data.course;

        this.userService.getStudentsForCourseOrClass(this.course._id,"course").subscribe(
          (data) => {
            console.log("Here students data",data.students);
            this.students = data.students;
          },
          (error) => {
            console.error("Error fetching students:", error);
        }); 
      });
    }
}
  decodeToken(token: string) {
    return jwt_decode(token);
   }


}
