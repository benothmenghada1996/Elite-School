import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-parents-tab',
  templateUrl: './parents-tab.component.html',
  styleUrls: ['./parents-tab.component.css']
})
export class ParentsTabComponent implements OnInit {
  parent:any={};
  parents:any=[];

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.refreshTable();
  }
  // goToEditParent(id){
  //   this.router.navigate([`/editParent/${id}`]);
  // }
  goToEditParent(id:number){
    this.router.navigate([`/editProfileParent/${id}`]);
  }
  deleteParent(id){
    this.userService.deleteUserById(id).subscribe(
      (success) => {
        console.log("Here success",success.msg);
        this.refreshTable();
      },
      (err) => {console.log("Here error",err);}
    );
  }

  refreshTable(){
    this.userService.getAllUsers("parent").subscribe(
      (success) => {
        console.log("Here success",success);
        this.parents = success.response;
      },
      (err) => {
        console.log("Here error",err);
      }
    );
  }
}
