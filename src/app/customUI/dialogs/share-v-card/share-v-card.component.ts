import { Component, OnInit, ViewChild, ElementRef, Injector, OnDestroy } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { Subscription } from 'rxjs';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';

@Component({
  selector: 'app-share-v-card',
  templateUrl: './share-v-card.component.html',
  styleUrls: ['./share-v-card.component.css']
})
export class ShareVCardComponent extends BaseClass implements OnInit, OnDestroy, ApiResponseCallback {


  constructor(private injector: Injector) {
    super(injector);
  }
  emailIds: string = "";
  shareEntityIdAndTypeSubscription: Subscription = null;
  entityInfo: any;
  mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  @ViewChild("closeShareVCard")
  closeShareVCard: ElementRef;


  ngOnInit() {
    getEntityTypeAndId(this);
  }
  onShareVCardClick() {
    if (this.emailIds.length > 0 && validateEmails(this, this.emailIds)) {
      this.apiHandler.shareVCard(this.emailIds, this.entityInfo.type, this.entityInfo.id, this);
    }
    else {
      this.commonFunctions.showErrorSnackbar("Invalid EmailId(s)");
    }
  }

  onSuccess(response: any) {
    this.dataService.onHideShowLoader(false);
    let responseBody = response.Envelope.Body;
    if (responseBody.hasOwnProperty('Fault')) {
      let errorCode = responseBody.Fault.code;
      let msg = responseBody.Fault.message;
      this.onError(errorCode, msg);
    }
    else {
      this.commonFunctions.showSnackbar("VCard Shared Successfully");
      this.closeShareVCard.nativeElement.click();
    }
  }
  onError(errorCode: number, errorMsg: string) {
    this.dataService.onHideShowLoader(false);
    this.commonFunctions.showErrorSnackbar(errorMsg);
  }
  ngOnDestroy(): void {
    if (this.shareEntityIdAndTypeSubscription != null && !this.shareEntityIdAndTypeSubscription.closed) {
      this.shareEntityIdAndTypeSubscription.unsubscribe();
    }
  }
}

function validateEmails(context: ShareVCardComponent, emailIds: string) {
  let validatonSuccess: boolean = true;
  let emails: string[] = emailIds.split(",");

  if (emails) {
    emails.every(function(element, index) {
      if (element.match(context.mailformat))
        return true;
      else {
        validatonSuccess = false;
        return false;
      }

    })
  }
  return validatonSuccess;
}

function getEntityTypeAndId(context: ShareVCardComponent) {
  context.shareEntityIdAndTypeSubscription = context.dataService.shareEntityIdAndTypeObservable.subscribe(data => {
    if (data)
      context.entityInfo = data;
  });
}
