import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { EntityModel } from '../../../models/entity-model';
import { OpenAlertsModel } from '../../../models/Open-Alerts-model';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';

@Component({
  selector: 'app-entity-alert',
  templateUrl: './entity-alert.component.html',
  styleUrls: ['./entity-alert.component.css']
})
export class EntityAlertComponent extends BaseClass implements OnInit, ApiResponseCallback {


  constructor(private injector: Injector) { super(injector) }
  pageNum: number = 0;
  moreDataAvailable: boolean = false;
  totalAndCurrentRowsRatio: string = "";
  entityModel: EntityModel;
  totalRows: any = 0;
  lastEntityID: any;
  openAlertModels: Array<OpenAlertsModel> = new Array();

  ngOnInit() {
    this.entityModel = JSON.parse(sessionStorage.getItem(this.constants.ENTITY_INFO));

    getData(this);
  }


  onSuccess(response: any) {
    let alerts: OpenAlertsModel[] = response.Alert;
    this.parseResponse(alerts);
    this.renderUI();
  }
  onError(errorCode: number, errorMsg: string) {
    this.renderUI();
    this.commonFunctions.showErrorSnackbar(errorMsg)
  }

  private parseResponse(agents: OpenAlertsModel[]) {
    agents.forEach(element => {
      if (element.severitydesc != "Total Alerts") {
        this.openAlertModels.push(element);
      }
      else {
        this.totalRows = element.rownum;
      }
    });
  }
  onAlertClick(item: OpenAlertsModel) {
    //this.dataService.onDataShare(item);
    sessionStorage.setItem(this.constants.SELECTED_ALERT, JSON.stringify(item));
    this.commonFunctions.navigateWithoutReplaceUrl(this.paths.PATH_OPEN_ALERT_DETAIL);
  }

  goBack() {
    this.commonFunctions.backPress();
  }
  public renderUI() {
    setData(this);
    updateRatioUI(this);
    checkMoreDataAvailable(this);
    this.cdr.markForCheck();
  }

  onLoadMoreClick() {
    makeServerRequest(this);
  }
}
function makeServerRequest(context: EntityAlertComponent) {
  context.pageNum++;
  //context.entityModel.entityId = "432100";
  context.apiHandler.getAlerts(context.entityModel.entityId, context.pageNum, context);
}

function setData(context: EntityAlertComponent) {
  sessionStorage.setItem(context.constants.ENTITY_ALERTS_ARRAY, JSON.stringify(context.openAlertModels));
  sessionStorage.setItem(context.constants.ENTITY_ALERTS_PAGE_NUMBER, JSON.stringify(context.pageNum));
  sessionStorage.setItem(context.constants.ENTITY_ALERTS_TOTAL_ROWS, context.totalRows);
  sessionStorage.setItem(context.constants.ENTITY_ALERTS_CURRENT_ENTITY_ID, context.entityModel.entityId);
}

function getData(context: EntityAlertComponent) {
  let dataArray = JSON.parse(sessionStorage.getItem(context.constants.ENTITY_ALERTS_ARRAY));
  context.lastEntityID = sessionStorage.getItem(context.constants.ENTITY_ALERTS_CURRENT_ENTITY_ID);
  if (dataArray && dataArray.length > 0 && context.lastEntityID === context.entityModel.entityId) {
    context.openAlertModels = dataArray;
    context.pageNum = Number(sessionStorage.getItem(context.constants.ENTITY_ALERTS_PAGE_NUMBER));
    context.totalRows = sessionStorage.getItem(context.constants.ENTITY_ALERTS_TOTAL_ROWS);
    updateRatioUI(context);
  }
  else {
    makeServerRequest(context);
  }

}
function checkMoreDataAvailable(context: EntityAlertComponent) {
  if (!context.openAlertModels || context.openAlertModels.length >= context.totalRows)
    context.moreDataAvailable = false;
  else
    context.moreDataAvailable = true;
}

function updateRatioUI(context: EntityAlertComponent) {
  context.commonFunctions.showLoadedItemTagOnHeader(context.openAlertModels, context.totalRows);
  //context.totalAndCurrentRowsRatio = context.commonFunctions.showMoreDataSnackbar(context.openAlertModels, context.totalRows);
  context.cdr.markForCheck();
}
