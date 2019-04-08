import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { Subscription } from 'rxjs';
import { AgentInfoModel } from 'src/app/models/TopAgentsModel';
import { EntityDetailBaseClass } from '../../../global/entity-detail-base-class';
import { Router } from '@angular/router';


@Component({
  selector: 'app-agent-detail',
  templateUrl: './agent-detail.component.html',
  styleUrls: ['./agent-detail.component.css']
})
export class AgentDetailComponent extends EntityDetailBaseClass implements OnInit, OnDestroy {

  agentInfoSubscription: Subscription = null;
  agentInfo: AgentInfoModel;

  constructor(injector: Injector,
    private router: Router) {
    super(injector);
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.agentInfo = JSON.parse(sessionStorage.getItem(this.constants.AGENT_INFO));
    this.addNewHistoryEntity(this.agentInfo);
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
