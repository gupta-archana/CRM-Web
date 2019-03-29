import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { Subscription } from 'rxjs';
import { AgentInfoModel } from 'src/app/models/TopAgentsModel';

import { BaseClass } from '../../../global/base-class';


@Component({
  selector: 'app-agent-detail',
  templateUrl: './agent-detail.component.html',
  styleUrls: ['./agent-detail.component.css']
})
export class AgentDetailComponent extends BaseClass implements OnInit, OnDestroy {

  agentInfoSubscription: Subscription = null;
  agentInfo: AgentInfoModel;

  constructor(injector: Injector) {
    super(injector);

  }

  ngOnInit() {
    this.agentInfo = JSON.parse(sessionStorage.getItem(this.constants.AGENT_INFO));
    //this.dataService.sendCurrentPagePath(paths.PATH_AGENT_DETAIL);
  }
  contactDetailClick() {
    this.commonFunctions.navigateWithoutReplaceUrl(this.paths.PATH_AGENT_CONTACT_DETAIL);
  }
  objectiveClick() {
    this.commonFunctions.navigateWithoutReplaceUrl(this.paths.PATH_AGENT_OBJECTIVE);
  }
  ngOnDestroy(): void {

  }

}
