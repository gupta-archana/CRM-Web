import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { Subscription } from 'rxjs';
import { AgentInfoModel } from 'src/app/models/TopAgentsModel';
import { EntityDetailBaseClass } from '../../../global/entity-detail-base-class';
import { Router } from '@angular/router';
import { VCard } from 'ngx-vcard';

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
    private router: Router) {
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

  openLocationOnMap(): void {
    if (navigator.geolocation) {
      let ref = navigator.geolocation.getCurrentPosition((position) => {
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        this.commonFunctions.printLog(latitude + "," + longitude);
        if ((navigator.platform.indexOf("iPhone") != -1)
          || (navigator.platform.indexOf("iPod") != -1)
          || (navigator.platform.indexOf("iPad") != -1))
          window.open("maps://maps.google.com/maps?daddr=" + latitude + "," + longitude);
        else
          window.open("http://maps.google.com/maps?daddr=" + latitude + "," + longitude);
      });
    } else {
      console.log("No support for geolocation")
    }
  }

  ngOnDestroy(): void {

  }

}
