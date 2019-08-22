import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { NotificationsModel } from '../../../models/notifications-model';
import { onErrorResumeNext } from 'rxjs';
import { EntityModel } from '../../../models/entity-model';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent extends BaseClass implements OnInit, ApiResponseCallback {

  notifications: Array<NotificationsModel> = [];
  entityModel: EntityModel = new EntityModel();
  pageNumber: number = 0;
  totalRows: any = 0;
  moreDataAvailable: boolean = true;
  totalAndCurrentRowsRatio: string = "";
  constructor(injector: Injector) { super(injector) }

  ngOnInit() {
    this.pageNumber = 0;
    makeServerRequest(this);
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
    let self = this;
    this.apiHandler.dismissNotification(notificationID, {
      onSuccess(response: any) {
        self.commonFunctions.showSnackbar(response)
        self.notifications.splice(index, 1);
        self.cdr.markForCheck();
      },
      onError(errorCode, errorMsg) {
        self.commonFunctions.showErrorSnackbar(errorMsg)
      }
    })
  }

  onLoadMoreClick() {
    makeServerRequest(this);
  }

  onSuccess(response: any) {
    let newNotifications: NotificationsModel[] = response.SysNotification;

    newNotifications.forEach(element => {
      if (element.entityType != "Total Notifications") {
        this.notifications.push(element)
      } else {
        this.totalRows = element.rowNum;
      }
    });


    this.renderUI();
  }
  onError(errorCode: number, errorMsg: string) {
    this.commonFunctions.showErrorSnackbar(errorMsg);
  }

  public renderUI() {
    checkMoreDataAvailable(this);
    updateRatioUI(this);
    this.cdr.markForCheck();
  }

  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
}

function makeServerRequest(context: NotificationsComponent) {
  context.pageNumber++;
  context.apiHandler.getNotifications(context.pageNumber, context);
}
function checkMoreDataAvailable(context: NotificationsComponent) {
  if ((!context.notifications && context.notifications.length == 0) || context.notifications.length >= context.totalRows)
    context.moreDataAvailable = false;
  else
    context.moreDataAvailable = true;
}
function updateRatioUI(context: NotificationsComponent) {
  context.totalAndCurrentRowsRatio = context.commonFunctions.showMoreDataSnackbar(context.notifications, context.totalRows);
  context.cdr.markForCheck();
}