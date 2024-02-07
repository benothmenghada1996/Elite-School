import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import jwt_decode from 'jwt-decode';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup;
  user:any={};
  errorMsg: string;
  constructor(private userService: UserService,private router: Router) { }
  ngOnInit() {

  }
  
  login(){
    console.log(this.user);
    this.userService.login(this.user).subscribe(
      (success) => {
        console.log("Here success",success);
        if (success.token) {
          sessionStorage.setItem("token",success.token)
          let user:any = this.decodeToken(success.token);
          console.log(user);

          if (user.role=="admin") {
            this.router.navigate(["admin"]);
          } 
          else if( user.status=="nok") {
            this.errorMsg ="Waiting for admin validation";
          }
          else if( user.status=="ok"){
            this.router.navigate(["teacherDashboard"]);
          }
          else if(user.role=="student"){
            this.router.navigate(["studentDashboard"]);
          }
          else if(user.role=="parent"){
            this.router.navigate([""]);
          }
        } 
        else {
          if(success.msg=="Not Validated"){
            this.errorMsg="Wait For Admin Validation" 
          }else{
            this.errorMsg="Please check your Tel/Pwd" 
          }
        } 
      },
      (err) => {console.log("Here error",err);}
    );
  }

  decodeToken(token: string) {
    return jwt_decode(token);
  }
}
