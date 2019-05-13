import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../../global/base-class';

@Component({
  selector: 'app-agent-associates',
  templateUrl: './agent-associates.component.html',
  styleUrls: ['./agent-associates.component.css']
})
export class AgentAssociatesComponent extends BaseClass implements OnInit {

  constructor(private injector: Injector) {
    super(injector);
  }

  ngOnInit() {

  }
  goBack() {
    this.commonFunctions.backPress();
  }
  onRecentProfileClick(){
    this.dataService.onRecentProfileClick();
  }
}
