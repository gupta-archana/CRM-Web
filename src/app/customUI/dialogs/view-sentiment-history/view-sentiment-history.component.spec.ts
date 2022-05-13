import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewSentimentHistoryComponent } from './view-sentiment-history.component';

describe('ViewSentimentHistoryComponent', () => {
  let component: ViewSentimentHistoryComponent;
  let fixture: ComponentFixture<ViewSentimentHistoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSentimentHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSentimentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
