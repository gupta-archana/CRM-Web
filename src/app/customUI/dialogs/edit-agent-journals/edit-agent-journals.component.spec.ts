import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAgentJournalsComponent } from './edit-agent-journals.component';

describe('EditAgentJournalsComponent', () => {
  let component: EditAgentJournalsComponent;
  let fixture: ComponentFixture<EditAgentJournalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAgentJournalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAgentJournalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
