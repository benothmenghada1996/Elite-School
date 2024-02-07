import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,PatternValidator } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  editProfileForm:FormGroup;
  userId: any;
  user: any= {};
  userTosend:any={};
  errorMsg="";
  imagePreview:any;
  pdfPreview:any;
  path: string;

  constructor(private formBuilder:FormBuilder, private userService : UserService,
    private router:Router,private activatedRoute : ActivatedRoute) { }

  ngOnInit() {
    this.userId=this.activatedRoute.snapshot.paramMap.get("id");
    this.userService.getUserById(this.userId).subscribe(
      (success) => {
        console.log("Here success",success.findedUser);
        this.user = success.findedUser;
      },
      (err) => {console.log("Here error",err);}
     );
    this.path=this.router.url;
    this.editProfileForm=this.formBuilder.group({
      firstName:[''],
      lastName:[''],
      email:['', [Validators.required,Validators.email]],
      tel:['', [Validators.required]],
      adress:['', [Validators.required,Validators.minLength(5)]],
      speciality:['', [Validators.required]],
      sonTel:['',[Validators.required]],
      pdf:[''],
      img:[''],
    })
  }

  isEdit(type: string,id:number): boolean {
    return this.path === `/editProfile${type}/${id}`; 
  }

  setFileType(): string {
    return this.isEdit('Student',this.userId) ? 'image' : 'pdf';
  }
  setUserRole(): string {
    return this.isEdit('Student',this.userId) ? 'student'
      : this.isEdit('Teacher',this.userId) ? 'teacher'
      : 'parent';
  }

  editProfile() {
    const fileType = this.setFileType();
    const role = this.setUserRole();
    this.editProfileForm.value.role = role;
    this.editProfileForm.value.id = this.user._id; //=userId
    this.editProfileForm.value.pwd = this.user.pwd;
  
    this.userService.editProfile(this.editProfileForm.value, fileType).subscribe(
      (success) => {
        console.log('Here Success:', success);
        if (success.msg === 'tel exists') {
          this.errorMsg = 'Phone number already exists';
        } else if (success.msg === 'inexisting sonTel') {
          this.errorMsg = 'Please check son Tel number';
        } else if (success.msg === 'Edited successfully') {
          this.router.navigate(['admin']);
        }
      },
      (error) => {
        console.log('Error', error);
      }
    );
  }
 
  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.editProfileForm.patchValue({ img: file });
    this.editProfileForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string
    };
    reader.readAsDataURL(file);
  }
  onPdfSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.editProfileForm.patchValue({ pdf: file });
    this.editProfileForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
     this.pdfPreview = reader.result as string
      };
    reader.readAsDataURL(file);
  }

}
