import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { ServiceComponent } from './component/service/service.component';
import { AboutComponent } from './component/about/about.component';
import { CourseComponent } from './component/course/course.component';
import { TeacherComponent } from './component/teacher/teacher.component';
import { ClubComponent } from './component/club/club.component';
import { CoursesComponent } from './component/courses/courses.component';
import { BannerComponent } from './component/banner/banner.component';
import { CarouselComponent } from './component/carousel/carousel.component';
import { AddCourseComponent } from './component/add-course/add-course.component';
import { AddClassComponent } from './component/add-class/add-class.component';
import { AdminComponent } from './component/admin/admin.component';
import { TeachersComponent } from './component/teachers/teachers.component';
import { CoursesTabComponent } from './component/courses-tab/courses-tab.component';
import { ClassesTabComponent } from './component/classes-tab/classes-tab.component';
import { StudentsTabComponent } from './component/students-tab/students-tab.component';
import { ParentsTabComponent } from './component/parents-tab/parents-tab.component';
import { TeachersTabComponent } from './component/teachers-tab/teachers-tab.component';
import { SignupComponent } from './component/signup/signup.component';
import { TeacherInfoComponent } from './component/teacher-info/teacher-info.component';
import { CourseInfoComponent } from './component/course-info/course-info.component';
import { StudentInfoComponent } from './component/student-info/student-info.component';
import { SearchTeacherBySpecialityComponent } from './component/search-teacher-by-speciality/search-teacher-by-speciality.component';
import { MySonCourseComponent } from './component/my-son-course/my-son-course.component';
import { CustomFilterPipe } from './pipes/custom-filter.pipe';
import { StudentClassListComponent } from './component/student-class-list/student-class-list.component';
import { EditProfileComponent } from './component/edit-profile/edit-profile.component';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    ServiceComponent,
    AboutComponent,
    CourseComponent,
    TeacherComponent,
    ClubComponent,
    CoursesComponent,
    BannerComponent,
    CarouselComponent,
    AddCourseComponent,
    AddClassComponent,
    AdminComponent,
    TeachersComponent,
    CoursesTabComponent,
    ClassesTabComponent,
    StudentsTabComponent,
    ParentsTabComponent,
    TeachersTabComponent,
    SignupComponent,
    TeacherInfoComponent,
    CourseInfoComponent,
    StudentInfoComponent,
    SearchTeacherBySpecialityComponent,
    MySonCourseComponent,
    CustomFilterPipe,
    StudentClassListComponent,
    EditProfileComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule, 
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
