import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentClassListComponent } from './student-class-list.component';

describe('StudentClassListComponent', () => {
  let component: StudentClassListComponent;
  let fixture: ComponentFixture<StudentClassListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentClassListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentClassListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
