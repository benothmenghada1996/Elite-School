import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTeacherBySpecialityComponent } from './search-teacher-by-speciality.component';

describe('SearchTeacherBySpecialityComponent', () => {
  let component: SearchTeacherBySpecialityComponent;
  let fixture: ComponentFixture<SearchTeacherBySpecialityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchTeacherBySpecialityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchTeacherBySpecialityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
