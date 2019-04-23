import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { Subscription } from 'rxjs';
import { AgentInfoModel } from 'src/app/models/TopAgentsModel';
import { EntityDetailBaseClass } from '../../../global/entity-detail-base-class';
import { Router } from '@angular/router';
import { VCard } from 'ngx-vcard';
import { DeviceDetectorService } from 'ngx-device-detector';
@Component({
  selector: 'app-agent-detail',
  templateUrl: './agent-detail.component.html',
  styleUrls: ['./agent-detail.component.css']
})
export class AgentDetailComponent extends EntityDetailBaseClass implements OnInit, OnDestroy {

  agentInfoSubscription: Subscription = null;
  agentInfo: AgentInfoModel;
  public vCard: VCard;
  constructor(injector: Injector,
    private router: Router,
    private deviceDetector: DeviceDetectorService) {
    super(injector);
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.agentInfo = JSON.parse(sessionStorage.getItem(this.constants.AGENT_INFO));
    this.addNewHistoryEntity(this.agentInfo);

    this.vCard = {
      name: {
        firstNames: this.agentInfo.name,
      }
    };

    this.vCard.title = this.agentInfo.name;
  }
  contactDetailClick() {
    this.commonFunctions.navigateWithoutReplaceUrl(this.paths.PATH_AGENT_CONTACT_DETAIL);
  }
  objectiveClick() {
    this.commonFunctions.navigateWithoutReplaceUrl(this.paths.PATH_AGENT_OBJECTIVE);
  }

  downloadVCard() {
  }

  openLocationOnMap(): void {
    let os = this.deviceDetector.os;
    switch (os) {
      case "Windows":
        window.open("https://maps.google.com/maps/place?q=" + this.agentInfo.city + "+" + this.agentInfo.state);
        break;
      case "Android":
        window.open("geo:0,0?q=" + this.agentInfo.city + "+" + this.agentInfo.state);
        break;
      case "Ios":
        window.open("maps://maps.google.com/maps/place?q=" + this.agentInfo.city + "+" + this.agentInfo.state);
        break;
      default:
        break;
    }
  }

  ngOnDestroy(): void {

  }

}
