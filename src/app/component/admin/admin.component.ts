import { Component, OnInit } from '@angular/core';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  user:any={};
  constructor() { }

  ngOnInit() {
    const jwt = sessionStorage.getItem("token");
    this.user=this.decodeToken(jwt);
  }
  decodeToken(token: string) {
    return jwt_decode(token);
  } 

}
