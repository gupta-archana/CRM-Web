import { Component, Injector, OnDestroy, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EntityDetailBaseClass } from '../../../global/entity-detail-base-class';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { EntityModel } from '../../../models/entity-model';
import { CommonApisService } from '../../../utils/common-apis.service';

@Component({
  selector: 'app-agent-detail',
  templateUrl: './agent-detail.component.html',
  styleUrls: ['./agent-detail.component.css']
})
export class AgentDetailComponent extends EntityDetailBaseClass implements OnInit, OnDestroy {



  agentInfoSubscription: Subscription = null;
  agentMenuSub: Subscription = null;
  agentInfo: EntityModel;
  agentMenues: any[];

  constructor(injector: Injector,
    private router: Router) {
    super(injector);
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.commonFunctions.showLoadedItemTagOnHeader([], 0, true);
  }

  ngOnInit() {
    this.agentInfo = JSON.parse(sessionStorage.getItem(this.constants.ENTITY_INFO));
    this.addNewHistoryEntity(this.agentInfo);
    getMenues(this);
  }


  onAgentMenuClick(item) {
    this.commonFunctions.onMenuItemClick(item, this.agentInfo);
  }

  sendVCard() {
  }

  checkEntityFavorite() {
    return !this.commonFunctions.checkFavorite(this.agentInfo.entityId);
  }

  onStarClick() {
    this.commonApis.setFavorite(this.agentInfo, this.apiHandler, this.cdr);
  }

  ngOnDestroy(): void {
    if (this.agentMenuSub && !this.agentMenuSub.closed) {
      this.agentMenuSub.unsubscribe();
    }

    if (this.agentInfoSubscription && !this.agentInfoSubscription.closed) {
      this.agentInfoSubscription.unsubscribe();
    }
  }
}

function getMenues(context: AgentDetailComponent) {
  context.agentMenuSub = context.utils.getAgentDetailItems().subscribe(success => {
    context.agentMenues = success;
    context.cdr.markForCheck();
  });

}

