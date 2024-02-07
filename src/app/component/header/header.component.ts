import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { UserService } from 'src/app/services/user.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  role : string;
  user:any;
  result:any={};
  timeResult:any={};


  constructor(private router : Router, private userService : UserService) { }

  ngOnInit() {
    this.isLoggedIn();
    this.userService.getTemperature().subscribe((data)=>{
      console.log("here response ", data.response);
      this.result = data.response;
      }
    ); 
    // Appeler la fonction pour mettre à jour l'heure chaque seconde
    this.updateTime();
  }
  isLoggedIn(){
    const jwt = sessionStorage.getItem("token");
    if (jwt) {
      this.user =this.decodeToken(jwt);
      console.log(this.user);
      
      this.role= this.user.role; 
    }
    return !!jwt
    }
    decodeToken(token: string) {
      return jwt_decode(token);
    } 
  logOut(){
  sessionStorage.removeItem("token");
  this.router.navigate([""]);
  } 
  updateTime() {
    this.userService.getCityTime().subscribe((doc)=>{
      console.log("here response ", doc.result);
      this.timeResult = doc.result;
      }
    ); 
    // Utiliser interval de RxJS pour créer un intervalle de mise à jour chaque seconde
    const timer = interval(1000); // 1000 ms = 1 seconde
    timer.subscribe(() => {
      // Mettre à jour l'heure à chaque intervalle
      const date = new Date();
      this.timeResult = date.toLocaleTimeString(); // Mettez ici le format d'heure que vous souhaitez afficher
    });
  }

}
