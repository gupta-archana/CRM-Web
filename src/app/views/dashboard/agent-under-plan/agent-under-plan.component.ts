import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { EntityModel } from '../../../models/entity-model';
import { BaseClass } from '../../../global/base-class';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { CommonApisService } from '../../../utils/common-apis.service';

@Component({
  selector: 'app-agent-under-plan',
  templateUrl: './agent-under-plan.component.html',
  styleUrls: ['./agent-under-plan.component.css']
})
export class AgentUnderPlanComponent extends BaseClass implements OnInit, OnDestroy, ApiResponseCallback {


  constructor(injector: Injector) { super(injector) }
  pageRefreshSubscription: Subscription = null;
  pageNumber: number = 0;
  totalRows: any = 0;
  moreDataAvailable: boolean = false;
  totalAndCurrentRowsRatio: string = "";
  agentsUnderPlan: EntityModel[];
  ngOnInit() {
    this.pageRefreshSubscription = this.dataService.pageRefreshObservable.subscribe(data => {
      refreshData(this);
    });
    getData(this);
  }
  onLoadMoreClick() {
    makeServerRequest(this);
  }

  onAgentClick(agent: EntityModel) {
    sessionStorage.setItem(this.constants.ENTITY_INFO, JSON.stringify(agent));
    setData(this);
    this.commonFunctions.navigateWithoutReplaceUrl(this.paths.PATH_AGENT_DETAIL);
  }

  onSuccess(response: any) {
    let data: EntityModel[] = response.profile;
    data.forEach(element => {
      if (element.type == "A") {
        this.commonFunctions.setFavoriteOnApisResponse(element);
        this.agentsUnderPlan.push(element);
      } else {
        this.totalRows = element.rowNum;
      }
    });

    this.renderUI();
  }

  onError(errorCode: number, errorMsg: string) {
    this.commonFunctions.showErrorSnackbar(errorMsg)
    this.renderUI();
  }

  public renderUI() {
    setData(this);
    updateRatioUI(this);
    checkMoreDataAvailable(this);
    this.cdr.markForCheck();
  }

  checkEntityFavorite(item: EntityModel) {
    return !this.commonFunctions.checkFavorite(item.entityId);
  }
  onStarClick(item: EntityModel, index: number) {
    this.commonApis.setFavorite(item, this.apiHandler, this.cdr).asObservable().subscribe(data => {
      this.renderUI();
    });
  }

  ngOnDestroy(): void {
    if (this.pageRefreshSubscription && !this.pageRefreshSubscription.closed) {
      this.pageRefreshSubscription.unsubscribe();
    }
  }
}
function makeServerRequest(context: AgentUnderPlanComponent) {
  context.pageNumber++;
  context.apiHandler.getTopAgents(context.pageNumber, context);
}


function getData(context: AgentUnderPlanComponent) {
  context.agentsUnderPlan = JSON.parse(sessionStorage.getItem(context.constants.AGENT_UNDER_PLAN_DATA));
  if (!context.agentsUnderPlan) {
    context.agentsUnderPlan = [];
    makeServerRequest(context);
  }
  else {
    context.pageNumber = Number(sessionStorage.getItem(context.constants.AGENT_UNDER_PLAN_CURRENT_PAGE_NO));
    context.totalRows = Number(sessionStorage.getItem(context.constants.AGENT_UNDER_PLAN_TOTAL_ROWS));
    context.renderUI();
  }
}

function setData(context: AgentUnderPlanComponent) {
  sessionStorage.setItem(context.constants.AGENT_UNDER_PLAN_CURRENT_PAGE_NO, context.pageNumber.toString());
  sessionStorage.setItem(context.constants.AGENT_UNDER_PLAN_DATA, JSON.stringify(context.agentsUnderPlan));
  sessionStorage.setItem(context.constants.AGENT_UNDER_PLAN_TOTAL_ROWS, context.totalRows);

}



function updateRatioUI(context: AgentUnderPlanComponent) {
  context.totalAndCurrentRowsRatio = context.commonFunctions.showMoreDataSnackbar(context.agentsUnderPlan, context.totalRows);
  context.cdr.markForCheck();
}

function checkMoreDataAvailable(context: AgentUnderPlanComponent) {
  if ((!context.agentsUnderPlan && context.agentsUnderPlan.length == 0) || context.agentsUnderPlan.length >= context.totalRows)
    context.moreDataAvailable = false;
  else
    context.moreDataAvailable = true;
}

function refreshData(context: AgentUnderPlanComponent) {
  context.pageNumber = 0;
  context.agentsUnderPlan = [];
  context.totalRows = 0;
  makeServerRequest(context);
}
