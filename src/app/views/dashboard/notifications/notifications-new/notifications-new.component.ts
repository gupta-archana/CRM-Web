import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../../../global/base-class';
import { ApiResponseCallback } from '../../../../Interfaces/ApiResponseCallback';
import { NotificationsModel } from '../../../../models/notifications-model';
import { EntityModel } from '../../../../models/entity-model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-notifications-new',
    templateUrl: './notifications-new.component.html',
    styleUrls: ['./notifications-new.component.css']
})
export class NotificationsNewComponent extends BaseClass implements OnInit, ApiResponseCallback {

    notifications: Array<NotificationsModel> = [];
    entityModel: EntityModel = new EntityModel();
    pageNumber = 0;
    totalRows: any = 0;
    moreDataAvailable = true;
    totalAndCurrentRowsRatio = "";
    hideNoDataDiv = false;
    errorMsg = "";
    tabIndexSubscription: Subscription;
    selectedTabIndex: number;
    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        this.pageNumber = 0;
        tabSelectedIndexSubscription(this);
        this.commonFunctions.hideShowTopScrollButton(document);
    }
    onAgentClick(item: NotificationsModel) {
        this.entityModel.type = this.constants.ENTITY_AGENT_PRESENTER;
        this.entityModel.entityId = item.entityID;
        this.entityModel.name = item.name ? item.name : '';
        sessionStorage.setItem(this.constants.ENTITY_INFO, JSON.stringify(this.entityModel));
        this.commonFunctions.navigateWithoutReplaceUrl(this.paths.PATH_AGENT_DETAIL);
    }
    onDismissClick(index: number, notificationID: string) {
        const self = this;
        this.apiHandler.dismissNotification(notificationID, {
            onSuccess(response: any) {
                self.commonFunctions.showSnackbar(response);
                self.notifications.splice(index, 1);
                self.dataService.onTabSelected(index);
                self.cdr.markForCheck();
            },
            onError(errorCode, errorMsg) {
                self.commonFunctions.showErrorSnackbar(errorMsg);
            }
        });
    }

    onLoadMoreClick() {
        makeServerRequest(this);
    }

    onSuccess(response: any) {
        const newNotifications: NotificationsModel[] = response.SysNotification;

        newNotifications.forEach(element => {
            if (element.entityType !== "Total Notifications") {
                this.notifications.push(element);
            } else {
                this.totalRows = element.rowNum;
            }
        });


        this.renderUI();
    }
    onError(errorCode: number, errorMsg: string) {
        this.errorMsg = errorMsg;
        this.renderUI();
    // this.commonFunctions.showErrorSnackbar(errorMsg);
    }

    public renderUI() {
        checkMoreDataAvailable(this);
        checkAndSetUi(this);
        updateRatioUI(this);
        this.cdr.markForCheck();
    }

    topFunction() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
}

function makeServerRequest(context: NotificationsNewComponent) {
    context.pageNumber++;
    context.apiHandler.getNotifications("N", context.pageNumber, context);
}
function checkMoreDataAvailable(context: NotificationsNewComponent) {
    if ((!context.notifications && context.notifications.length === 0) || context.notifications.length >= context.totalRows) {
        context.moreDataAvailable = false;
    } else {
        context.moreDataAvailable = true;
    }
}

function checkAndSetUi(context: NotificationsNewComponent) {
    if (!context.notifications || context.notifications.length === 0) {
        resetData(context);
    } else {
        context.hideNoDataDiv = true;
    }
    context.cdr.markForCheck();
}

function updateRatioUI(context: NotificationsNewComponent) {
    context.commonFunctions.showLoadedItemTagOnHeader(context.notifications, context.totalRows);
    context.cdr.markForCheck();
}

function tabSelectedIndexSubscription(context: NotificationsNewComponent) {
    context.tabIndexSubscription = context.dataService.tabSelectedObservable.subscribe((index: number) => {
        context.selectedTabIndex = index;
        if (index === 0) {
            updateRatioUI(context);
            if (context.notifications.length <= 0) {
                makeServerRequest(context);
            }
        }
    });
}
function resetData(context: NotificationsNewComponent) {
    context.pageNumber = 0;
    context.notifications = [];
    context.totalRows = 0;
    context.moreDataAvailable = false;
    context.hideNoDataDiv = false;
}
