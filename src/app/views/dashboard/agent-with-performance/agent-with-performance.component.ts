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
  constructor(injector: Injector, private commonApis: CommonApisService) { super(injector) }

  ngOnInit() {
    this.commonFunctions.hideShowTopScrollButton();
    this.pageRefreshSubscription = this.dataService.pageRefreshObservable.subscribe(data => {
      refreshData(this);
    });
    this.getData();
  }

  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  onSuccess(response: any) {
    let data: EntityModel[] = response.profile;
    data.forEach(element => {
      if (element.type == "A") {
        this.agentPerformance.push(element);
      } else {
        this.totalRows = element.rowNum;
      }
    });
    this.setData();
    this.renderUI();
  }
  onError(errorCode: number, errorMsg: string) {

  }

  private renderUI() {
    this.updateRatioUI();
    this.checkMoreDataAvailable();
    this.cdr.markForCheck();
  }

  onLoadMoreClick() {
    makeServerRequest(this);
  }

  onStarClick(item: EntityModel, index: number) {
    this.commonApis.setFavorite(item, this.apiHandler, this.cdr).asObservable().subscribe(data => {
      this.setData();
    });
  }

  private setData() {
    sessionStorage.setItem(this.constants.AGENT_PERFORMANCE_CURRENT_PAGE_NO, this.pageNumber.toString());
    sessionStorage.setItem(this.constants.AGENT_PERFORMANCE_DATA, JSON.stringify(this.agentPerformance));
    sessionStorage.setItem(this.constants.AGENT_PERFORMANCE_TOTAL_ROWS, this.totalRows);

  }

  private getData() {
    this.agentPerformance = JSON.parse(sessionStorage.getItem(this.constants.AGENT_PERFORMANCE_DATA));
    if (!this.agentPerformance) {
      this.agentPerformance = [];
      makeServerRequest(this);
    }
    else {
      this.pageNumber = Number(sessionStorage.getItem(this.constants.AGENT_PERFORMANCE_CURRENT_PAGE_NO));
      this.totalRows = Number(sessionStorage.getItem(this.constants.AGENT_PERFORMANCE_TOTAL_ROWS));
      this.renderUI();
    }
  }

  updateRatioUI() {
    this.totalAndCurrentRowsRatio = this.commonFunctions.showMoreDataSnackbar(this.agentPerformance, this.totalRows);
    this.cdr.markForCheck();
  }

  checkMoreDataAvailable() {
    if (!this.agentPerformance || this.agentPerformance.length == this.totalRows)
      this.moreDataAvailable = false;
    else
      this.moreDataAvailable = true;
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

function refreshData(context: AgentWithPerformanceComponent) {
  context.pageNumber = 0;
  context.agentPerformance = [];
  makeServerRequest(context);
}
