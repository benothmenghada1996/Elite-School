import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { AddCourseComponent } from './component/add-course/add-course.component';
import { AddClassComponent } from './component/add-class/add-class.component';
import { AdminComponent } from './component/admin/admin.component';
import { TeachersTabComponent } from './component/teachers-tab/teachers-tab.component';
import { StudentsTabComponent } from './component/students-tab/students-tab.component';
import { ParentsTabComponent } from './component/parents-tab/parents-tab.component';
import { LoginComponent } from './component/login/login.component';
import { SignupComponent } from './component/signup/signup.component';
import { TeacherInfoComponent } from './component/teacher-info/teacher-info.component';
import { CourseComponent } from './component/course/course.component';
import { ClassesTabComponent } from './component/classes-tab/classes-tab.component';
import { CourseInfoComponent } from './component/course-info/course-info.component';
import { SearchTeacherBySpecialityComponent } from './component/search-teacher-by-speciality/search-teacher-by-speciality.component';
import { CoursesComponent } from './component/courses/courses.component';
import { MySonCourseComponent } from './component/my-son-course/my-son-course.component';
import { StudentClassListComponent } from './component/student-class-list/student-class-list.component';
import { AuthGuard } from './services/auth.guard';
import { EditProfileComponent } from './component/edit-profile/edit-profile.component';
import { StudentInfoComponent } from './component/student-info/student-info.component';
import { CoursesTabComponent } from './component/courses-tab/courses-tab.component';


const routes: Routes = [
  {path : "" , component : HomeComponent},
  {path : "login" , component : LoginComponent},
  {path : "signupAdmin" , component : SignupComponent},
  {path : "signupStudent" , component : SignupComponent},
  {path : "signupTeacher" , component : SignupComponent},
  {path : "signupParent" , component : SignupComponent},
  {path : "admin" , component : AdminComponent,canActivate:[AuthGuard]},
  {path : "teacherDashboard" , component : AdminComponent,canActivate:[AuthGuard]},
  {path : "studentDashboard" , component : AdminComponent,canActivate:[AuthGuard]},
  {path : "teachersTab" , component : TeachersTabComponent,canActivate:[AuthGuard]},
  {path : "studentsTab" , component : StudentsTabComponent,canActivate:[AuthGuard]},
  {path:"teacherStudentsTab/:id", component:StudentsTabComponent,canActivate:[AuthGuard]},
  {path : "parentsTab" , component : ParentsTabComponent,canActivate:[AuthGuard]},
  {path : "coursesTab" , component : CoursesTabComponent,canActivate:[AuthGuard]},
  {path : "classesTab" , component : ClassesTabComponent,canActivate:[AuthGuard]},
  {path : "courseInfo/:id" , component : CourseInfoComponent,canActivate:[AuthGuard]},
  {path:"editClass/:id", component:AddClassComponent,canActivate:[AuthGuard]},
  {path : "addClass" , component : AddClassComponent,canActivate:[AuthGuard]},
  {path : "addCourse" , component : AddCourseComponent,canActivate:[AuthGuard]},
  {path:"editCourse/:id", component:AddCourseComponent,canActivate:[AuthGuard]},
  {path:"editProfileTeacher/:id", component:EditProfileComponent,canActivate:[AuthGuard]},
  {path:"editProfileStudent/:id", component:EditProfileComponent,canActivate:[AuthGuard]},
  {path:"editProfileParent/:id", component:EditProfileComponent,canActivate:[AuthGuard]},
  {path:"searchTeacher", component:SearchTeacherBySpecialityComponent},
  {path:"courses", component:CoursesComponent},
  {path : "teacherInfo/:id" , component : TeacherInfoComponent,canActivate:[AuthGuard]},
  {path : "studentInfo/:id" , component : StudentInfoComponent,canActivate:[AuthGuard]},
  {path:"sonCourses", component:MySonCourseComponent,canActivate:[AuthGuard]},
  {path:"studentClassList/:id", component:StudentClassListComponent,canActivate:[AuthGuard]},
  {path:"**", redirectTo:""},

  // {path : "studentDashboard" , component : StudentDashboardComponent,canActivate:[AuthGuard]},
  // {path : "teacherDashboard" , component : TeacherDashboardComponent,canActivate:[AuthGuard]},
  // {path:"teacherStudentsTab", component:TeacherStudentsTabComponent,canActivate:[AuthGuard]},
  // {path:"teacherCoursesTab", component:TeacherCoursesTabComponent,canActivate:[AuthGuard]},
  // {path:"studentCoursesTab", component:StudentCoursesTabComponent},
  // {path:"affectStudent/:id", component:AffectStudentToClassComponent,canActivate:[AuthGuard]},
  // {path:"affectTeacher/:id", component:AffectTeacherToclassComponent,canActivate:[AuthGuard]},
  // {path:"affectCourse/:id", component:AffectCourseToClassComponent,canActivate:[AuthGuard]},
  // // {path:"addNote/:id", component:AddNoteEvaluationComponent,canActivate:[AuthGuard]},
  // {path : "teacherInfo/:id" , component : TeacherInfoComponent,canActivate:[AuthGuard]},
  // {path : "studentInfo/:id" , component : TeacherInfoComponent,canActivate:[AuthGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
