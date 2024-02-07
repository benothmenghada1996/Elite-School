import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,PatternValidator } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm:FormGroup;
  errorMsg="";
  imagePreview:any;
  pdfPreview:any;
  path: string;
  fileToUpload:string;

  constructor(private formBuilder:FormBuilder, private userService : UserService,
    private router:Router) { }

  ngOnInit() {
    this.path=this.router.url;
    this.signupForm=this.formBuilder.group({
      firstName:['', [Validators.required,Validators.minLength(3)]],
      lastName:['', [Validators.required,Validators.minLength(5)]],
      email:['', [Validators.required,Validators.email]],
      tel:['', [Validators.required]],
      pwd:['', [Validators.required,
        Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=.*[$@$!%*?&])(?=[^A-Z]*[A-Z])/)]],
      adress:['', [Validators.required,Validators.minLength(5)]],
      speciality:['', [Validators.required]],
      sonTel:["",[Validators.required]],
      pdf:[""],
      img:[""],
    })
  }

  isSignup(type: string): boolean {
    return this.path === `/signup${type}`; 
  }

  setFileType(): string {
    return this.isSignup('Student') || this.isSignup('Admin') ? 'image' : 'pdf';
  }

  setUserRole(): string {
    return this.isSignup('Admin') ? 'admin'
      : this.isSignup('Student') ? 'student'
      : this.isSignup('Teacher') ? 'teacher'
      : 'parent';
  }

  signup() {
    const fileType = this.setFileType();
    const role = this.setUserRole();

    if ((role === 'admin' || role === 'student') && !this.signupForm.value.img ) {
      this.errorMsg = 'Please upload your avatar!';
      return;
    }
    if (role === 'teacher' && !this.signupForm.value.pdf) {
      this.errorMsg = 'Please upload your CV!';
      return;
    }

    this.signupForm.value.role = role;
    
    console.log(this.signupForm.value);
  
    this.userService.signUp(this.signupForm.value, fileType).subscribe(
      (success) => {
        console.log('Success:', success);
        if (success.msg === 'tel exists') {
          this.errorMsg = 'Phone number already exists';
        } else if (success.msg === '0') {
          this.errorMsg = 'Please check your son Tel number';
        } else if (success.msg === 'added successfully') {
          this.router.navigate(['login']);
        }
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }
 
  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.signupForm.patchValue({ img: file });
    this.signupForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string
    };
    reader.readAsDataURL(file);
  }
  onPdfSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.signupForm.patchValue({ pdf: file });
    this.signupForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
     this.pdfPreview = reader.result as string
      };
    reader.readAsDataURL(file);
  }

}
