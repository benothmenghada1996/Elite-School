import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})

export class CoursesComponent implements OnInit {
  courses:any=[];

  constructor(private courseService : CourseService) { }
  ngOnInit() {
    this.courseService.getAllCourses().subscribe((data)=>{
      this.courses=data.coursesTab;
    });
  }

}

