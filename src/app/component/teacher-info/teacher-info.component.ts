import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-teacher-info',
  templateUrl: './teacher-info.component.html',
  styleUrls: ['./teacher-info.component.css']
})
export class TeacherInfoComponent implements OnInit {
  user:any={};
  teacher:any={};
  teacherId:string;
  pdfData: SafeResourceUrl; // Utilisation de SafeResourceUrl pour des raisons de sécurité
  

  constructor(private userService:UserService, private activatedRoute:ActivatedRoute,private sanitizer: DomSanitizer,
    private router:Router) { }

  ngOnInit() {
    this.teacherId=this.activatedRoute.snapshot.paramMap.get("id"); // récuperer l'ID du teacher depuis l'URL
      this.userService.getUserById(this.teacherId).subscribe(
        (data) => {
          console.log('Here data', data.findedUser);
              this.teacher = data.findedUser;
              // Utilisation de this.sanitizer.bypassSecurityTrustResourceUrl pour marquer l'URL comme sûre avant de l'assigner à pdfData.
              // this.pdfData = this.sanitizer.bypassSecurityTrustResourceUrl(this.teacher.avatar);
        // Vérification si this.teacher et this.teacher.avatar sont définis avant d'accéder à la propriété avatar
        if (this.teacher && this.teacher.avatar) {
          // Utilisation de this.sanitizer.bypassSecurityTrustResourceUrl pour marquer l'URL comme sûre avant de l'assigner à pdfData.
          this.pdfData = this.sanitizer.bypassSecurityTrustResourceUrl(this.teacher.avatar);
        }

        },
        (err) => {
          console.log('Here error', err);
        }
      );
  }


}
