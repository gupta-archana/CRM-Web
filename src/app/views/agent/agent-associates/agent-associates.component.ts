import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { AssociatesModel } from '../../../models/associates-model';
import { EntityModel } from '../../../models/entity-model';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';

@Component({
  selector: 'app-agent-associates',
  templateUrl: './agent-associates.component.html',
  styleUrls: ['./agent-associates.component.css']
})
export class AgentAssociatesComponent extends BaseClass implements OnInit, OnDestroy, ApiResponseCallback {


  associatesModels: AssociatesModel[] = new Array;
  entityModel: EntityModel;
  totalRows: any = 0;
  moreDataAvailable: boolean = false;
  totalAndCurrentRowsRatio: string = "";
  currentEntityID = "";
  pageNum = 0;
  clickedEntity: EntityModel = new EntityModel();
  destroyed: boolean = false;
  hideNoDataDiv: boolean = false;
  errorMsg: string = "";

  constructor(private injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.destroyed = false;
    this.entityModel = JSON.parse(sessionStorage.getItem(this.constants.ENTITY_INFO));
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
    if (!this.destroyed) {
      let persons: AssociatesModel[] = response.affiliation;
      persons.forEach(element => {
        if (element.dispname != "TotalAssociates") {
          this.associatesModels.push(element);
        } else {
          this.totalRows = element.rowNum;
        }
        this.totalRows = this.associatesModels.length;
      });

      setAssociates(this);
      this.renderUI();
    }
  }


  onError(errorCode: number, errorMsg: string) {
    if (!this.destroyed) {
      this.errorMsg = errorMsg;
      this.renderUI();
      //this.commonFunctions.showErrorSnackbar(errorMsg);
    }
  }

  public renderUI() {
    updateRatioUI(this);
    checkAndSetUi(this);
    checkMoreDataAvailable(this);
    this.cdr.markForCheck();
  }



  getAddress(item: AssociatesModel) {
    return item.city + " " + item.state;
  }
  onPersonClick(item: AssociatesModel) {
    this.getEntityModel(item);
    sessionStorage.setItem(this.constants.ENTITY_INFO, JSON.stringify(this.clickedEntity));
    let navigatingPath = this.paths.PATH_PERSON_DETAIL;
    this.commonFunctions.navigateWithoutReplaceUrl(navigatingPath);
  }
  private getEntityModel(item: AssociatesModel) {
    this.clickedEntity.name = item.dispname;
    this.clickedEntity.entityId = item.personID;
    this.clickedEntity.stat = item.stat;
    this.clickedEntity.type = this.constants.ENTITY_PERSON_PRESENTER
  }
  ngOnDestroy(): void {
    this.destroyed = true;
  }
}

function getAssociates(context: AgentAssociatesComponent) {
  let dataArray = JSON.parse(sessionStorage.getItem(context.constants.ASSOCIATES_ARRAY));
  context.currentEntityID = sessionStorage.getItem(context.constants.ASSOCIATES_CURRENT_ENTITY_ID);
  if (dataArray && dataArray.length > 0 && context.currentEntityID === context.entityModel.entityId) {
    context.associatesModels = dataArray;
    context.pageNum = Number(sessionStorage.getItem(context.constants.ASSOCIATES_PAGE_NUMBER));
    context.totalRows = sessionStorage.getItem(context.constants.ASSOCIATES_TOTAL_ROWS);
    context.renderUI();
  }
  else {
    makeServerRequest(context);
  }
}

function setAssociates(context: AgentAssociatesComponent) {
  sessionStorage.setItem(context.constants.ASSOCIATES_ARRAY, JSON.stringify(context.associatesModels));
  sessionStorage.setItem(context.constants.ASSOCIATES_PAGE_NUMBER, JSON.stringify(context.pageNum));
  sessionStorage.setItem(context.constants.ASSOCIATES_TOTAL_ROWS, context.totalRows);
  sessionStorage.setItem(context.constants.ASSOCIATES_CURRENT_ENTITY_ID, context.entityModel.entityId);
}

function makeServerRequest(context: AgentAssociatesComponent) {
  if (context.entityModel.type) {
    context.pageNum++;
    context.apiHandler.getAssociates(context.entityModel.entityId, context.entityModel.type, context.pageNum, context);
  }
}

function checkMoreDataAvailable(context: AgentAssociatesComponent) {
  if (!context.associatesModels || context.associatesModels.length == context.totalRows)
    context.moreDataAvailable = false;
  else
    context.moreDataAvailable = true;
}

function updateRatioUI(context: AgentAssociatesComponent) {
  context.commonFunctions.showLoadedItemTagOnHeader(context.associatesModels, context.totalRows);
  //context.totalAndCurrentRowsRatio = context.commonFunctions.showMoreDataSnackbar(context.associatesModels, context.totalRows);
  context.cdr.markForCheck();
}
function checkAndSetUi(context: AgentAssociatesComponent) {
  if (!context.associatesModels || context.associatesModels.length == 0) {
    resetData(context);
  }
  else {
    context.hideNoDataDiv = true;
  }
  context.cdr.markForCheck();
}

function resetData(context: AgentAssociatesComponent) {

  context.associatesModels = [];
  context.totalRows = 0;
  context.moreDataAvailable = false;
  context.hideNoDataDiv = false;
}
