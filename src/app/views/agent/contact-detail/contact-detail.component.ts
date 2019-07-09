import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { CommonFunctionsService } from '../../../utils/common-functions.service';
import { BaseClass } from '../../../global/base-class';
import { DeviceDetectorService } from 'ngx-device-detector';
import { EntityModel } from '../../../models/entity-model';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { EntityContactModel } from '../../../models/entity-contact-model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent extends BaseClass implements OnInit, ApiResponseCallback, OnDestroy {
  deviceInfo = null;
  entityModel: EntityModel;
  dataUpdatedSubscription: Subscription;
  entityContactModel: EntityContactModel = new EntityContactModel();
  constructor(private injector: Injector,
    private deviceDetector: DeviceDetectorService, ) {
    super(injector);
  }

  ngOnInit() {
    this.entityModel = JSON.parse(sessionStorage.getItem(this.constants.ENTITY_INFO));
    getContactDetailFromServer(this);
    registerDataUpdatedObservable(this);
  }
  goBack() {
    this.commonFunctions.backPress();
  }

  doEmail() {
    var mailContent = "mailto:" + this.entityContactModel.email;
    window.location.href = mailContent;
  }

  doCall(number) {
    var call = "tel:" + number;
    window.location.href = call;
  }

  doSMS(number) {
    var call = "sms:" + number;
    window.location.href = call;
  }

  getAddress() {
    let address: string = "";
    address = this.entityContactModel.addr1 + " " + this.entityContactModel.addr2 + " " + this.entityContactModel.addr3 + " " + this.entityContactModel.addr4 + " " + this.entityContactModel.city;
    return address;
  }

  onEditProfileClick() {
    this.dataService.onAgentProfileEditClick(this.entityContactModel);
  }

  openLocationOnMap(): void {
    let os = this.deviceDetector.os;
    let mapLocAddress = this.entityModel.addr1 + "+" + this.entityModel.addr2 + "+" + this.entityModel.addr3 + "+" + this.entityModel.addr4 + "+" + this.entityModel.city + "+" + this.entityModel.state;

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
      "type": this.entityContactModel.entity,
      "id": this.entityModel.entityId
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
  onSuccess(response: any) {
    this.entityContactModel = response.entitycontact[0];
    this.entityContactModel.name = this.entityModel.name;
    this.cdr.markForCheck();
  }
  onError(errorCode: number, errorMsg: string) {

  }

  ngOnDestroy(): void {
    if (this.dataUpdatedSubscription && !this.dataUpdatedSubscription.closed)
      this.dataUpdatedSubscription.unsubscribe();
  }
}

function getContactDetailFromServer(context: ContactDetailComponent) {
  context.apiHandler.getEntityContactDetail(context.entityModel.entityId, context.entityModel.type, context);
}
function registerDataUpdatedObservable(context: ContactDetailComponent) {
  context.dataUpdatedSubscription = context.dataService.dataUpdatedObservable.subscribe(isUpdated => {
    if (isUpdated) {
      getContactDetailFromServer(context);
    }
  });
}
