import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { NotificationsModel } from '../../../models/notifications-model';
import { onErrorResumeNext } from 'rxjs';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent extends BaseClass implements OnInit, ApiResponseCallback {

  notifications: Array<NotificationsModel> = [];
  constructor(injector: Injector) { super(injector) }

  ngOnInit() {
    this.apiHandler.getNotifications(this);

  }

  onDismissClick(index: number, notificationID: string) {
    let self = this;
    this.apiHandler.dismissNotification(notificationID, {
      onSuccess(response: any) {
        self.commonFunctions.showSnackbar(response)
        self.notifications.splice(index, 1);
        self.cdr.markForCheck();

      }
      ,
      onError(errorCode, errorMsg) {
        self.commonFunctions.showErrorSnackbar(errorMsg)
      }
    })
  }

  onSuccess(response: any) {
    this.notifications = response.SysNotification;
    this.cdr.markForCheck();
  }
  onError(errorCode: number, errorMsg: string) {
    this.commonFunctions.showErrorSnackbar(errorMsg);
  }
}
