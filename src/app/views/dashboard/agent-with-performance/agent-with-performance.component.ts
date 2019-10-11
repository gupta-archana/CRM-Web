import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseClass } from '../../../global/base-class';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { EntityModel } from '../../../models/entity-model';
import { CommonApisService } from '../../../utils/common-apis.service';

@Component({
  selector: 'app-agent-with-performance',
  templateUrl: './agent-with-performance.component.html',
  styleUrls: ['./agent-with-performance.component.css']
})
export class AgentWithPerformanceComponent extends BaseClass implements OnInit, OnDestroy, ApiResponseCallback {


  pageRefreshSubscription: Subscription = null;
  pageNumber: number = 0;
  totalRows: any = 0;
  moreDataAvailable: boolean = false;
  totalAndCurrentRowsRatio: string = "";
  agentPerformance: EntityModel[];
  constructor(injector: Injector) { super(injector) }

  ngOnInit() {
    this.commonFunctions.hideShowTopScrollButton(document);
    this.pageRefreshSubscription = this.dataService.pageRefreshObservable.subscribe(data => {
      refreshData(this);
    });
    getData(this);
  }

  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  onSuccess(response: any) {
    let data: EntityModel[] = response.profile;
    data.forEach(element => {
      if (element.type == "A") {
        this.commonFunctions.setFavoriteOnApisResponse(element);
        this.agentPerformance.push(element);
      } else {
        this.totalRows = element.rowNum;
      }
    });
    this.agentPerformance = this.agentPerformance.reverse();
    this.renderUI();
  }
  onError(errorCode: number, errorMsg: string) {
    this.commonFunctions.showErrorSnackbar(errorMsg)
  }

  getAddress(item: EntityModel) {
    return this.commonFunctions.getAddress(item);
  }

  onAgentClick(agent: EntityModel) {
    sessionStorage.setItem(this.constants.ENTITY_INFO, JSON.stringify(agent));
    setData(this);
    this.commonFunctions.navigateWithoutReplaceUrl(this.paths.PATH_AGENT_DETAIL);
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

function makeServerRequest(context: AgentWithPerformanceComponent) {
  context.pageNumber++;
  context.apiHandler.getAgentPerformance(context.pageNumber, context);
}

function setData(context: AgentWithPerformanceComponent) {
  sessionStorage.setItem(context.constants.AGENT_PERFORMANCE_CURRENT_PAGE_NO, context.pageNumber.toString());
  sessionStorage.setItem(context.constants.AGENT_PERFORMANCE_DATA, JSON.stringify(context.agentPerformance));
  sessionStorage.setItem(context.constants.AGENT_PERFORMANCE_TOTAL_ROWS, context.totalRows);

}

function getData(context: AgentWithPerformanceComponent) {
  context.agentPerformance = JSON.parse(sessionStorage.getItem(context.constants.AGENT_PERFORMANCE_DATA));
  if (!context.agentPerformance) {
    context.agentPerformance = [];
    makeServerRequest(context);
  }
  else {
    context.pageNumber = Number(sessionStorage.getItem(context.constants.AGENT_PERFORMANCE_CURRENT_PAGE_NO));
    context.totalRows = Number(sessionStorage.getItem(context.constants.AGENT_PERFORMANCE_TOTAL_ROWS));
    context.renderUI();
  }
}

function updateRatioUI(context: AgentWithPerformanceComponent) {
  context.commonFunctions.showLoadedItemTagOnHeader(context.agentPerformance, context.totalRows);
  //context.totalAndCurrentRowsRatio = context.commonFunctions.showMoreDataSnackbar(context.agentPerformance, context.totalRows);
  context.cdr.markForCheck();
}

function checkMoreDataAvailable(context: AgentWithPerformanceComponent) {
  if ((!context.agentPerformance && context.agentPerformance.length == 0) || context.agentPerformance.length >= context.totalRows)
    context.moreDataAvailable = false;
  else
    context.moreDataAvailable = true;
}


function refreshData(context: AgentWithPerformanceComponent) {
  context.pageNumber = 0;
  context.agentPerformance = [];
  context.totalRows = 0;
  makeServerRequest(context);
}
