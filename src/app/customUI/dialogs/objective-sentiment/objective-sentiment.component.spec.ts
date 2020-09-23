import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveSentimentComponent } from './objective-sentiment.component';

describe('ObjectiveSentimentComponent', () => {
  let component: ObjectiveSentimentComponent;
  let fixture: ComponentFixture<ObjectiveSentimentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectiveSentimentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectiveSentimentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
