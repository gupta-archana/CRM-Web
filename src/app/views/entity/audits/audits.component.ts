import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { EntityModel } from '../../../models/entity-model';
import { AuditModels } from '../../../models/audit-models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-audits',
  templateUrl: './audits.component.html',
  styleUrls: ['./audits.component.css']
})
export class AuditsComponent extends BaseClass implements OnInit {

  constructor(private injector: Injector) { super(injector) }
  pageNum: number = 0;
  moreDataAvailable: boolean = false;
  totalAndCurrentRowsRatio: string = "";
  entityModel: EntityModel;
  totalRows: any = 0;
  lastEntityID: any;
  auditsModels: Array<AuditModels> = new Array();
  hideNoDataDiv: boolean = false;
  errorMsg: string = "";
  ngOnInit() {
    this.entityModel = JSON.parse(sessionStorage.getItem(this.constants.ENTITY_INFO));
    getData(this);

  }


  onSuccess(response: any) {
    let alerts: AuditModels[] = response[response.name];
    this.parseResponse(alerts);
    this.renderUI();
  }
  onError(errorCode: number, errorMsg: string) {
    this.errorMsg = errorMsg;
    this.renderUI();
    //this.commonFunctions.showErrorSnackbar(errorMsg)
  }


  onAuditSelected(item: AuditModels) {
    //this.dataService.onDataShare(item);
    sessionStorage.setItem(this.constants.SELECTED_AUDIT, JSON.stringify(item));
    if (item.stat == "Completed")
      this.commonFunctions.navigateWithoutReplaceUrl(this.paths.PATH_AGENT_AUDIT_COMPLETED);
    else
      this.commonFunctions.navigateWithoutReplaceUrl(this.paths.PATH_AGENT_AUDIT_QUEUED);
  }

  private parseResponse(agents: AuditModels[]) {
    agents.forEach(element => {
      if (element.auditType != "TotalNotes") {
        this.auditsModels.push(element);
      }
      else {
        this.totalRows = element.rowNum;
      }
    });
  }

  getFormattedDate(date: string) {
    return date.substring(0, 10);
  }
  goBack() {
    this.commonFunctions.backPress();
  }

  public renderUI() {
    setData(this);
    checkAndSetUi(this);
    updateRatioUI(this);
    checkMoreDataAvailable(this);
    this.cdr.markForCheck();
  }

  onLoadMoreClick() {
    makeServerRequest(this);
  }
}
function makeServerRequest(context: AuditsComponent) {
  context.pageNum++;
  //context.entityModel.entityId = "436005";
  context.apiHandler.getAgentAudits(context.entityModel.entityId, context.pageNum, context);
}

function setData(context: AuditsComponent) {
  sessionStorage.setItem(context.constants.ENTITY_AUDITS_ARRAY, JSON.stringify(context.auditsModels));
  sessionStorage.setItem(context.constants.ENTITY_AUDITS_PAGE_NUMBER, JSON.stringify(context.pageNum));
  sessionStorage.setItem(context.constants.ENTITY_AUDITS_TOTAL_ROWS, context.totalRows);
  sessionStorage.setItem(context.constants.ENTITY_AUDITS_CURRENT_ENTITY_ID, context.entityModel.entityId);
}

function getData(context: AuditsComponent) {
  let dataArray = JSON.parse(sessionStorage.getItem(context.constants.ENTITY_AUDITS_ARRAY));
  context.lastEntityID = sessionStorage.getItem(context.constants.ENTITY_AUDITS_CURRENT_ENTITY_ID);
  if (dataArray && dataArray.length > 0 && context.lastEntityID === context.entityModel.entityId) {
    context.auditsModels = dataArray;
    context.pageNum = Number(sessionStorage.getItem(context.constants.ENTITY_AUDITS_PAGE_NUMBER));
    context.totalRows = sessionStorage.getItem(context.constants.ENTITY_AUDITS_TOTAL_ROWS);
    //updateRatioUI(context);
    context.renderUI();
  }
  else {
    makeServerRequest(context);
  }

}
function checkMoreDataAvailable(context: AuditsComponent) {
  if (!context.auditsModels || context.auditsModels.length >= context.totalRows)
    context.moreDataAvailable = false;
  else
    context.moreDataAvailable = true;
}

function updateRatioUI(context: AuditsComponent) {
  context.commonFunctions.showLoadedItemTagOnHeader(context.auditsModels, context.totalRows);
  //context.totalAndCurrentRowsRatio = context.commonFunctions.showMoreDataSnackbar(context.auditsModels, context.totalRows);
  context.cdr.markForCheck();

}
function checkAndSetUi(context: AuditsComponent) {
  if (!context.auditsModels || context.auditsModels.length == 0) {
    resetData(context);
  }
  else {
    context.hideNoDataDiv = true;
  }
  context.cdr.markForCheck();
}

function resetData(context: AuditsComponent) {
  context.pageNum = 0;
  context.auditsModels = [];
  context.totalRows = 0;
  context.moreDataAvailable = false;
  context.hideNoDataDiv = false;
}
