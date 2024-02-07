import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {
@Input()t:any;
  constructor() { }

  ngOnInit() {
  }

}
