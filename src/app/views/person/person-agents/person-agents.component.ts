import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { EntityModel } from '../../../models/entity-model';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { PersonAgentsModel } from '../../../models/person-agents-model';
import { RoutingStateService } from '../../../services/routing-state.service';

@Component({
  selector: 'app-person-agents',
  templateUrl: './person-agents.component.html',
  styleUrls: ['./person-agents.component.css']
})
export class PersonAgentsComponent extends BaseClass implements OnInit, OnDestroy, ApiResponseCallback {

  constructor(injector: Injector, private routingState: RoutingStateService) { super(injector); }

  pageNum: number = 0;
  moreDataAvailable: boolean = false;
  totalAndCurrentRowsRatio: string = "";
  entityModel: EntityModel;
  totalRows: any = 0;
  personAgentsModels: Array<PersonAgentsModel> = new Array();
  clickedEntity: EntityModel = new EntityModel();
  currentEntityID: any;
  hideNoDataDiv: boolean = false;
  errorMsg: string = "";
  ngOnInit() {
    this.entityModel = JSON.parse(sessionStorage.getItem(this.constants.INTERNAL_ENTITY_MODEL));
    this.commonFunctions.printLog("last url " + this.routingState.getPreviousUrl());
    getData(this);
  }

  onSuccess(response: any) {
    let agents: PersonAgentsModel[] = response.affiliatedperson;
    this.parseResponse(agents);
    this.renderUI();
  }
  private parseResponse(agents: PersonAgentsModel[]) {
    agents.forEach(element => {
      if (element.name != "Totalaffiliatiedperson") {
        this.personAgentsModels.push(element);
      }
      else {
        this.totalRows = element.rowNum;
      }
    });
  }

  onError(errorCode: number, errorMsg: string) {
    this.errorMsg = errorMsg;
    this.renderUI();
  }

  onLoadMoreClick() {
    makeServerRequest(this);
  }

  onAgentClick(item: PersonAgentsModel) {
    this.getEntityModel(item);
    sessionStorage.setItem(this.constants.ENTITY_INFO, JSON.stringify(this.clickedEntity));
    let navigatingPath = this.paths.PATH_AGENT_DETAIL;
    this.commonFunctions.navigateWithoutReplaceUrl(navigatingPath);
  }

  onRecentProfileClick() {
    //navigateToSelectedItem(this, this.paths.PATH_RECENT_PROFILES);
    this.dataService.onRecentProfileClick();

  }
  public renderUI() {
    setData(this);
    checkAndSetUi(this);
    updateRatioUI(this);
    checkMoreDataAvailable(this);
    this.cdr.markForCheck();
  }

  private getEntityModel(item: PersonAgentsModel) {
    this.clickedEntity.name = item.name;
    this.clickedEntity.entityId = item.agentId;
    this.clickedEntity.city = item.city;
    this.clickedEntity.stat = item.stat;
    this.clickedEntity.state = item.state;
  }

  goBack() {
    this.commonFunctions.backPress();
  }
  ngOnDestroy(): void {

  }
}
function makeServerRequest(context: PersonAgentsComponent) {
  context.pageNum++;
  //context.entityModel.entityId = "1";
  context.apiHandler.getPersonAffiliations(context.entityModel.entityId, context.pageNum, context);
}

function setData(context: PersonAgentsComponent) {
  sessionStorage.setItem(context.constants.PERSON_AGENTS_ARRAY, JSON.stringify(context.personAgentsModels));
  sessionStorage.setItem(context.constants.PERSON_AGENTS_PAGE_NUMBER, JSON.stringify(context.pageNum));
  sessionStorage.setItem(context.constants.PERSON_AGENTS_TOTAL_ROWS, context.totalRows);
  sessionStorage.setItem(context.constants.PERSON_AGENTS_CURRENT_ENTITY_ID, context.entityModel.entityId);
}

function getData(context: PersonAgentsComponent) {
  let dataArray = JSON.parse(sessionStorage.getItem(context.constants.PERSON_AGENTS_ARRAY));
  context.currentEntityID = sessionStorage.getItem(context.constants.PERSON_AGENTS_CURRENT_ENTITY_ID);
  if (dataArray && dataArray.length > 0 && context.currentEntityID === context.entityModel.entityId) {
    context.personAgentsModels = dataArray;
    context.pageNum = Number(sessionStorage.getItem(context.constants.PERSON_AGENTS_PAGE_NUMBER));
    context.totalRows = sessionStorage.getItem(context.constants.PERSON_AGENTS_TOTAL_ROWS);
    updateRatioUI(context);
  }
  else {
    makeServerRequest(context);
  }

}
function checkMoreDataAvailable(context: PersonAgentsComponent) {
  if (!context.personAgentsModels || context.personAgentsModels.length >= context.totalRows)
    context.moreDataAvailable = false;
  else
    context.moreDataAvailable = true;
}

function updateRatioUI(context: PersonAgentsComponent) {
  context.commonFunctions.showLoadedItemTagOnHeader(context.personAgentsModels, context.totalRows);
  //context.totalAndCurrentRowsRatio = context.commonFunctions.showMoreDataSnackbar(context.personAgentsModels, context.totalRows);
  context.cdr.markForCheck();
}

function checkAndSetUi(context: PersonAgentsComponent) {
  if (!context.personAgentsModels || context.personAgentsModels.length == 0) {
    resetData(context);
  }
  else {
    context.hideNoDataDiv = true;
  }
  context.cdr.markForCheck();
}

function resetData(context: PersonAgentsComponent) {
  context.pageNum = 0;
  context.personAgentsModels = [];
  context.totalRows = 0;
  context.moreDataAvailable = false;
  context.hideNoDataDiv = false;
}

