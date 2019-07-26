import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../global/base-class';
import { ConfigNotificationModel } from '../../models/config-notification-model';

@Component({
  selector: 'app-notification-controls',
  templateUrl: './notification-controls.component.html',
  styleUrls: ['./notification-controls.component.css']
})
export class NotificationControlsComponent extends BaseClass implements OnInit {

  claimCreated: ConfigNotificationModel = null;
  claimClosed: ConfigNotificationModel = null;
  claimReserveIncreaded: ConfigNotificationModel = null;
  potentialRecoveryPosted: ConfigNotificationModel = null;
  recoveryReceived: ConfigNotificationModel = null;
  newRemittanceBatchCreated: ConfigNotificationModel = null;
  remittanceBatchCompleted: ConfigNotificationModel = null;
  newAlertCreated: ConfigNotificationModel = null;
  accountingPeriodCompleted: ConfigNotificationModel = null;
  newAuditCreated: ConfigNotificationModel = null;
  auditCompleted: ConfigNotificationModel = null;
  auditScheduled: ConfigNotificationModel = null;
  auditQueued: ConfigNotificationModel = null;

  notificationControls: Array<ConfigNotificationModel> = null;

  constructor(private injector: Injector) { super(injector) }

  ngOnInit() {

    this.notificationControls = JSON.parse(this.myLocalStorage.getValue(this.constants.USER_NOTIFICATIONS_CONTROLS));
    parseNotificationControls(this);

  }
  onCheckClick(event: ConfigNotificationModel) {
    this.commonApis.updateBasicConfig(event.configType, event.configuration);
  }
}

function parseNotificationControls(context: NotificationControlsComponent) {
  context.notificationControls.forEach(element => {
    element.configuration = JSON.parse(element.configuration)
    switch (element.configType) {
      case "AlertNew":
        context.newAlertCreated = element;
        break;
      case "arInvoiceComplete":
        context.potentialRecoveryPosted = element;
        break;
      case "arInvoiceNew":
        context.recoveryReceived = element;
        break;
      case "auditFinish":
        context.auditCompleted = element;
        break;
      case "auditNew":
        context.newAuditCreated = element;
        break;
      case "auditQueue":
        context.auditQueued = element;
        break;
      case "batchCreate":
        context.newRemittanceBatchCreated = element;
        break;
      case "batchInvoice":
        context.remittanceBatchCompleted = element;
        break;
      case "claimAdjReqApprove":
        context.claimReserveIncreaded = element;
        break;
      case "claimClose":
        context.claimClosed = element;
        break;
      case "claimNew":
        context.claimCreated = element;
        break;
      case "periodAccountingClose":
        context.accountingPeriodCompleted = element;
        break;
      // case "AlertNew":

      //   break;

      default:
        break;
    }
  });
}
