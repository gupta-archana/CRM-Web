import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { AssociatesModel } from '../../../models/associates-model';
import { EntityModel } from '../../../models/entity-model';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';

@Component({
  selector: 'app-agent-associates',
  templateUrl: './agent-associates.component.html',
  styleUrls: ['./agent-associates.component.css']
})
export class AgentAssociatesComponent extends BaseClass implements OnInit, ApiResponseCallback {


  associatesModels: AssociatesModel[] = new Array;
  agentInfo: EntityModel;
  totalRows: any = 0;
  moreDataAvailable: boolean = true;
  totalAndCurrentRowsRatio: string = "";
  currentEntityID = "";
  pageNum = 0;
  constructor(private injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.agentInfo = JSON.parse(sessionStorage.getItem(this.constants.AGENT_INFO));
    getAssociates(this);
  }
  goBack() {
    this.commonFunctions.backPress();
  }
  onRecentProfileClick() {
    this.dataService.onRecentProfileClick();
  }

  onLoadMoreClick() {
    makeServerRequest(this);
  }

  onSuccess(response: any) {
    this.associatesModels = this.associatesModels.concat(response.agentperson);
    this.checkDataAvailable(response.agentperson);
    this.cdr.markForCheck();
    setAssociates(this);
  }


  onError(errorCode: number, errorMsg: string) {
    this.checkDataAvailable([]);
    this.commonFunctions.showErrorSnackbar(errorMsg);
  }


  private checkDataAvailable(array: Array<any>) {
    if (!this.associatesModels || this.associatesModels.length == 0)
      this.moreDataAvailable = false;
  }


  getAddress(item: AssociatesModel) {
    return item.address1 + " " + item.address2 + " " + item.city + " " + item.state + " " + item.county;
  }

}

function getAssociates(context: AgentAssociatesComponent) {
  let dataArray = JSON.parse(sessionStorage.getItem(context.constants.ASSOCIATES_ARRAY));
  context.currentEntityID = sessionStorage.getItem(context.constants.ASSOCIATES_CURRENT_ENTITY_ID);
  if (dataArray && dataArray.length > 0 && context.currentEntityID === context.agentInfo.entityId) {
    context.associatesModels = dataArray;
    context.pageNum = Number(sessionStorage.getItem(context.constants.ASSOCIATES_PAGE_NUMBER));
    context.totalRows = sessionStorage.getItem(context.constants.ASSOCIATES_TOTAL_ROWS);
  }
  else {
    makeServerRequest(context);
  }
}

function setAssociates(context: AgentAssociatesComponent) {
  sessionStorage.setItem(context.constants.ASSOCIATES_ARRAY, JSON.stringify(context.associatesModels));
  sessionStorage.setItem(context.constants.ASSOCIATES_PAGE_NUMBER, JSON.stringify(context.pageNum));
  sessionStorage.setItem(context.constants.ASSOCIATES_TOTAL_ROWS, context.totalRows);
  sessionStorage.setItem(context.constants.ASSOCIATES_CURRENT_ENTITY_ID, context.agentInfo.entityId);
}

function makeServerRequest(context: AgentAssociatesComponent) {
  context.pageNum++;
  //context.agentInfo.entityId = "017575";
  context.apiHandler.getAssociates(context.agentInfo.entityId, context.agentInfo.type, context.pageNum, context);
}
