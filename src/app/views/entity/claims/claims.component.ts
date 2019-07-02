import { Component, OnInit, Injector } from '@angular/core';
import { EntityModel } from '../../../models/entity-model';
import { BaseClass } from '../../../global/base-class';
import { ClaimsModel } from '../../../models/claims-model';

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.css']
})
export class ClaimsComponent extends BaseClass implements OnInit {

  constructor(private injector: Injector) { super(injector) }
  pageNum: number = 0;
  moreDataAvailable: boolean = false;
  totalAndCurrentRowsRatio: string = "";
  entityModel: EntityModel;
  totalRows: any = 0;
  lastEntityID: any;
  claimsModels: Array<ClaimsModel> = new Array();
  ngOnInit() {
    this.entityModel = JSON.parse(sessionStorage.getItem(this.constants.ENTITY_INFO));
    getData(this);
  }


  onSuccess(response: any) {
    let alerts: ClaimsModel[] = response[response.name];
    this.parseResponse(alerts);
    this.renderUI();
  }
  onError(errorCode: number, errorMsg: string) {
    this.renderUI();
  }


  onClaimSelected(item: ClaimsModel) {
    //this.dataService.onDataShare(item);
    sessionStorage.setItem(this.constants.SELECTED_CLAIM, JSON.stringify(item));
    this.commonFunctions.navigateWithoutReplaceUrl(this.paths.PATH_CLAIM_DETAIL);
  }

  private parseResponse(agents: ClaimsModel[]) {
    agents.forEach(element => {
      if (element.summary != "Total Count") {
        this.claimsModels.push(element);
      }
      else {
        this.totalRows = element.rownum;
      }
    });
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
function makeServerRequest(context: ClaimsComponent) {
  context.pageNum++;
  //context.entityModel.entityId = "436005";
  context.apiHandler.getClaims(context.entityModel.entityId, context.pageNum, context);
}

function setData(context: ClaimsComponent) {
  sessionStorage.setItem(context.constants.ENTITY_CLAIMS_ARRAY, JSON.stringify(context.claimsModels));
  sessionStorage.setItem(context.constants.ENTITY_CLAIMS_PAGE_NUMBER, JSON.stringify(context.pageNum));
  sessionStorage.setItem(context.constants.ENTITY_CLAIMS_TOTAL_ROWS, context.totalRows);
  sessionStorage.setItem(context.constants.ENTITY_CLAIMS_CURRENT_ENTITY_ID, context.entityModel.entityId);
}

function getData(context: ClaimsComponent) {
  let dataArray = JSON.parse(sessionStorage.getItem(context.constants.ENTITY_CLAIMS_ARRAY));
  context.lastEntityID = sessionStorage.getItem(context.constants.ENTITY_CLAIMS_CURRENT_ENTITY_ID);
  if (dataArray && dataArray.length > 0 && context.lastEntityID === context.entityModel.entityId) {
    context.claimsModels = dataArray;
    context.pageNum = Number(sessionStorage.getItem(context.constants.ENTITY_CLAIMS_PAGE_NUMBER));
    context.totalRows = sessionStorage.getItem(context.constants.ENTITY_CLAIMS_TOTAL_ROWS);
    updateRatioUI(context);
  }
  else {
    makeServerRequest(context);
  }

}
function checkMoreDataAvailable(context: ClaimsComponent) {
  if (!context.claimsModels || context.claimsModels.length >= context.totalRows)
    context.moreDataAvailable = false;
  else
    context.moreDataAvailable = true;
}

function updateRatioUI(context: ClaimsComponent) {
  context.totalAndCurrentRowsRatio = context.commonFunctions.showMoreDataSnackbar(context.claimsModels, context.totalRows);
  context.cdr.markForCheck();
}
