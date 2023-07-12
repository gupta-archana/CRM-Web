import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../global/base-class';
import { ConfigNotificationModel } from '../../models/config-notification-model';
import { ApiResponseCallback } from '../../Interfaces/ApiResponseCallback';

@Component({
    selector: 'app-notification-controls',
    templateUrl: './notification-controls.component.html',
    styleUrls: ['./notification-controls.component.css']
})
export class NotificationControlsComponent extends BaseClass implements OnInit, ApiResponseCallback {

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

    constructor(private injector: Injector) {
        super(injector);
    }

    ngOnInit() {

        this.notificationControls = JSON.parse(this.myLocalStorage.getValue(this.constants.USER_NOTIFICATIONS_CONTROLS));
        parseNotificationControls(this);

    }
    onCheckClick(event: ConfigNotificationModel) {
        this.commonApis.updateBasicConfig(event.configType, event.configuration, this);
    }

    onSuccess(response: any) {
        this.myLocalStorage.setValue(this.constants.USER_NOTIFICATIONS_CONTROLS, JSON.stringify(this.notificationControls));
    }
    onError(errorCode: number, errorMsg: string) {

    }

    goBack(){
        this.commonFunctions.backPress();
    }

}

function parseNotificationControls(context: NotificationControlsComponent) {
    context.notificationControls.forEach(element => {
        element.configuration = JSON.parse(element.configuration);
        switch (element.configType.toLowerCase()) {
            case "alertnew":
                context.newAlertCreated = element;
                break;
            case "arinvoicecomplete":
                context.potentialRecoveryPosted = element;
                break;
            case "arinvoicenew":
                context.recoveryReceived = element;
                break;
            case "auditfinish":
                context.auditCompleted = element;
                break;
            case "auditnew":
                context.newAuditCreated = element;
                break;
            case "auditqueue":
                context.auditQueued = element;
                break;
            case "batchcreate":
                context.newRemittanceBatchCreated = element;
                break;
            case "batchinvoice":
                context.remittanceBatchCompleted = element;
                break;
            case "claimadjreqapprove":
                context.claimReserveIncreaded = element;
                break;
            case "claimclose":
                context.claimClosed = element;
                break;
            case "claimnew":
                context.claimCreated = element;
                break;
            case "periodaccountingclose":
                context.accountingPeriodCompleted = element;
                break;
                // case "AlertNew":

                //   break;

            default:
                break;
        }
    });
}
