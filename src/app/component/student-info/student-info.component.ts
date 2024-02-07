import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-student-info',
  templateUrl: './student-info.component.html',
  styleUrls: ['./student-info.component.css']
})
export class StudentInfoComponent implements OnInit {
  student:any={};
  studentId:string;
  imgData: SafeResourceUrl; // Utilisation de SafeResourceUrl pour des raisons de sécurité

  constructor(private userService:UserService, private activatedRoute:ActivatedRoute,private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.studentId=this.activatedRoute.snapshot.paramMap.get("id"); // récuperer l'ID de l'utilisateur depuis l'URL
    this.userService.getUserById(this.studentId).subscribe(
      (data) => {
        console.log('Here data', data);
            this.student = data.findedUser;
            // Utilisation de this.sanitizer.bypassSecurityTrustResourceUrl pour marquer l'URL comme sûre avant de l'assigner à imgData.
            this.imgData = this.sanitizer.bypassSecurityTrustResourceUrl(this.student.avatar);
      },
      (err) => {
        console.log('Here error', err);
      }
    );
  }

}
