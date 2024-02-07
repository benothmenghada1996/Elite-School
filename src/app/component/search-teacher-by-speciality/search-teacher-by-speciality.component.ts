import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-search-teacher-by-speciality',
  templateUrl: './search-teacher-by-speciality.component.html',
  styleUrls: ['./search-teacher-by-speciality.component.css']
})
export class SearchTeacherBySpecialityComponent implements OnInit {
  searchTeacherForm:FormGroup;
  teachersTab: any ;
  teacher:any={};
  courses:any={};

  constructor(private userService:UserService) { }

  ngOnInit() {
  }
  search(){
    this.userService.getTeacherBySpeciality(this.teacher).subscribe((data) => {
      this.teachersTab = data.teachers;
      console.log("Here finded Teachers", this.teachersTab);
      // Iterating through each teacher
      for (const teacher of this.teachersTab) {
        // Retrieving courses for each teacher
        this.userService.getUserCourses(teacher._id,"teacher").subscribe(
          (coursesData) => {
            console.log(`Courses for ${teacher.firstName} ${teacher.lastName}`, coursesData.courses);
            // Assigning courses to a property in the teacher object
            teacher.courses = coursesData.courses;
          },
          (error) => {
            console.log(`Error retrieving courses for ${teacher.firstName} ${teacher.lastName}`, error);
          }
        );
      }
    });
  }
} 
