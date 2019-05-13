import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../../global/base-class';

@Component({
  selector: 'app-agent-thirteen-month-activity',
  templateUrl: './agent-thirteen-month-activity.component.html',
  styleUrls: ['./agent-thirteen-month-activity.component.css']
})
export class AgentThirteenMonthActivityComponent extends BaseClass implements OnInit {

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
