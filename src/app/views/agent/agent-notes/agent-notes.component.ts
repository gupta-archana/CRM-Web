import { Component, OnInit, Injector } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseClass } from '../../../global/base-class';


@Component({
  selector: 'app-agent-notes',
  templateUrl: './agent-notes.component.html',
  styleUrls: ['./agent-notes.component.css']
})
export class AgentNotesComponent extends BaseClass implements OnInit {
  constructor(private injector: Injector) {
    super(injector);
  }
  entityInfo: any;
 
  ngOnInit() {
  }
 
}
