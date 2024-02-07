import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MySonCourseComponent } from './my-son-course.component';

describe('MySonCourseComponent', () => {
  let component: MySonCourseComponent;
  let fixture: ComponentFixture<MySonCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MySonCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySonCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
