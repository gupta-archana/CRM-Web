import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentJournalsComponent } from './agent-journals.component';

describe('AgentjournalsComponent', () => {
  let component: AgentJournalsComponent;
  let fixture: ComponentFixture<AgentJournalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentJournalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentJournalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
