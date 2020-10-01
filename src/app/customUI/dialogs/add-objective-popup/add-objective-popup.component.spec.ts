import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddObjectivePopupComponent } from './add-objective-popup.component';

describe('AddObjectivePopupComponent', () => {
  let component: AddObjectivePopupComponent;
  let fixture: ComponentFixture<AddObjectivePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddObjectivePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddObjectivePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
