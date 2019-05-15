import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { Subscription } from 'rxjs';
import { AgentInfoModel } from 'src/app/models/TopAgentsModel';
import { EntityDetailBaseClass } from '../../../global/entity-detail-base-class';
import { Router } from '@angular/router';

import { DeviceDetectorService } from 'ngx-device-detector';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { EntityModel } from '../../../models/entity-model';
@Component({
  selector: 'app-agent-detail',
  templateUrl: './agent-detail.component.html',
  styleUrls: ['./agent-detail.component.css']
})
export class AgentDetailComponent extends EntityDetailBaseClass implements OnInit, OnDestroy, ApiResponseCallback {


  agentInfoSubscription: Subscription = null;
  agentMenuSub: Subscription = null;
  agentInfo: EntityModel;
  agentMenues: any[];

  constructor(injector: Injector,
    private router: Router,
    private deviceDetector: DeviceDetectorService) {
    super(injector);
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.agentInfo = JSON.parse(sessionStorage.getItem(this.constants.AGENT_INFO));
    this.addNewHistoryEntity(this.agentInfo);
    getMenues(this);
  }


  onAgentMenuClick(item) {

    let navigatingUrl = "";
    let value = item.title == this.paths.AGENT_DETAIL_THIRTEEN_MONTH_ACTIVITY
    switch (item.title) {
      case this.constants.AGENT_DETAIL_CONTACT:
        navigatingUrl = this.paths.PATH_AGENT_CONTACT_DETAIL;
        break;
      case this.constants.AGENT_DETAIL_NOTES:
        navigatingUrl = this.paths.PATH_NOTES;
        break;
      case this.constants.AGENT_DETAIL_ASSOCIATES:
        navigatingUrl = this.paths.PATH_AGENT_ASSOCIATES;
        break;
      case this.constants.AGENT_DETAIL_THIRTEEN_MONTH_ACTIVITY:
        navigatingUrl = this.paths.PATH_THIRTEEN_MONTH_ACTIVITY;
        break;
      case this.constants.AGENT_DETAIL_OBJECTIVE:
        navigatingUrl = this.paths.PATH_AGENT_OBJECTIVE;
        break;
      case this.constants.AGENT_DETAIL_EVENTS:

        break;
      case this.constants.AGENT_DETAIL_TAGS:

        break;
      case this.constants.AGENT_DETAIL_COMPLIANCE:

        break;
      case this.constants.AGENT_DETAIL_ALERTS:
        break;

      case this.constants.AGENT_DETAIL_CLAIMS:

        break;
      case this.constants.AGENT_DETAIL_SOCIAL:

        break;
      case this.constants.AGENT_DETAIL_EMAILS:

        break;
      case this.constants.AGENT_DETAIL_AUDITS:

        break;
      default:
        break;
    }

    if (navigatingUrl)
      this.commonFunctions.navigateWithoutReplaceUrl(navigatingUrl);

    else
      this.commonFunctions.showErrorSnackbar("We are working on it");
  }

  sendVCard() {
  }

  onSort($event) {
    this.agentMenues.splice($event.newIndex, 0, this.agentMenues.splice($event.oldIndex, 1)[0]);
    this.Save();

  }
  openLocationOnMap(): void {
    let os = this.deviceDetector.os;
    let mapLocAddress = this.agentInfo.addr1 + "+" + this.agentInfo.addr2 + "+" + this.agentInfo.addr3 + "+" + this.agentInfo.addr4 + "+" + this.agentInfo.city + "+" + this.agentInfo.state;

    switch (os) {
      case "Windows":
        window.open("https://maps.google.com/maps/place?q=" + mapLocAddress);
        break;
      case "Android":
        window.open("geo:0,0?q=" + mapLocAddress);
        break;
      case "Ios":
        window.open("maps://maps.google.com/maps/place?q=" + mapLocAddress);
        break;
      default:
        break;
    }
  }

  ngOnDestroy(): void {
    if (this.agentMenuSub && !this.agentMenuSub.closed) {
      this.agentMenuSub.unsubscribe();
    }

    if (this.agentInfoSubscription && !this.agentInfoSubscription.closed) {
      this.agentInfoSubscription.unsubscribe();
    }
  }

  onSuccess(response: any) {
    this.agentMenues = response;
    this.Save();
    this.cdr.markForCheck();
  }
  private Save() {
    this.myLocalStorage.setValue(this.constants.AGENT_DETAIL_MENUES, JSON.stringify(this.agentMenues));
    this.cdr.markForCheck();
  }

  onError(errorCode: number, errorMsg: string) {
    this.commonFunctions.showErrorSnackbar(errorMsg);
  }
}

function getMenues(context: AgentDetailComponent) {
  context.agentMenuSub = context.utils.getAgentDetailItems().subscribe(success => {
    context.agentMenues = success;
    context.cdr.markForCheck();
  });

}
