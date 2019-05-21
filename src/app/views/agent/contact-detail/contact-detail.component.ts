import { Component, OnInit, Injector } from '@angular/core';
import { CommonFunctionsService } from '../../../utils/common-functions.service';
import { BaseClass } from '../../../global/base-class';
import { DeviceDetectorService } from 'ngx-device-detector';
import { EntityModel } from '../../../models/entity-model';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent extends BaseClass implements OnInit {
  deviceInfo = null;
  agentInfo: EntityModel;
  constructor(private injector: Injector,
    private deviceDetector: DeviceDetectorService, ) {
    super(injector);
  }

  ngOnInit() {
    this.agentInfo = JSON.parse(sessionStorage.getItem(this.constants.AGENT_INFO));
  }
  goBack() {
    this.commonFunctions.backPress();
  }

  private doEmail() {
    var mailContent = "mailto:adam.millendorf@outlook.com?cc=divyanshu@jklm.com&bcc=div@jkm.com&subject=subject&body=" + encodeURIComponent("<b>Hello I am body</b>");
    window.location.href = mailContent;
  }

  private doCall() {
    var call = "tel:720-434-1417";
    window.location.href = call;
  }

  private doSMS() {
    var call = "sms:720-434-1417";
    window.location.href = call;
  }

  private onEditProfileClick() {
    this.dataService.onAgentProfileEditClick(true);
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
  shareVCard() {
    let userInfo = {
      "type": this.agentInfo.type,
      "id": this.agentInfo.entityId
    }
    this.dataService.onShareEntityIdAndType(userInfo);
  }

  copyText(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.commonFunctions.showSnackbar("Copied");
  }

}
