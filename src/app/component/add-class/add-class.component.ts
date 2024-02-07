import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassService } from 'src/app/services/class.service';

@Component({
  selector: 'app-add-class',
  templateUrl: './add-class.component.html',
  styleUrls: ['./add-class.component.css']
})
export class AddClassComponent implements OnInit {

  class : any={};
  addOrEditClassForm: FormGroup;
  classId: any;
  title:string="Add Class";

  constructor(private activatedRoute : ActivatedRoute,private router :Router,private classService: ClassService,) { }

  ngOnInit() {
    this.classId=this.activatedRoute.snapshot.paramMap.get("id");
    if (this.classId){
     this.title="Edit Class"
     this.classService.getClassById(this.classId).subscribe(
         (data) => {
           console.log("Here success",data);
           this.class = data.class;
         },
         (err) => {console.log("Here error",err);}
        );
    } 
  }

  addOrEditClass(){
    console.log("Added or Edited Class", this.class);
    if (this.classId){
      this.classService.editClass(this.class).subscribe(
        (success) => {console.log("Here success",success);
          this.router.navigate(["admin"]);},
        (err) => {console.log("Here error",err);}
      );
    }
    this.classService.addClass(this.class).subscribe(
      (success) => {
        console.log("Here success", success.msg);
        this.router.navigate(["classesTab"]);
      },
      (err) => {
        console.log("Here error", err);
      }
    );
  }

}
