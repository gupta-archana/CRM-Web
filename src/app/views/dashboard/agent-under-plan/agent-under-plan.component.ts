import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { EntityModel } from '../../../models/entity-model';
import { BaseClass } from '../../../global/base-class';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';

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
    this.getData();
  }
  onLoadMoreClick() {
    makeServerRequest(this);
  }
  onSuccess(response: any) {
    let data: EntityModel[] = response.profile;
    data.forEach(element => {
      if (element.type == "A") {
        this.agentsUnderPlan.push(element);
      } else {
        this.totalRows = element.rowNum;
      }
    });
    this.setData();
    this.renderUI();
  }
  private renderUI() {
    this.updateRatioUI();
    this.checkMoreDataAvailable();
    this.cdr.markForCheck();
  }

  onError(errorCode: number, errorMsg: string) {
    
  }


  private setData() {
    sessionStorage.setItem(this.constants.AGENT_UNDER_PLAN_CURRENT_PAGE_NO, this.pageNumber.toString());
    sessionStorage.setItem(this.constants.AGENT_UNDER_PLAN_DATA, JSON.stringify(this.agentsUnderPlan));
    sessionStorage.setItem(this.constants.AGENT_UNDER_PLAN_TOTAL_ROWS, this.totalRows);

  }

  private getData() {
    this.agentsUnderPlan = JSON.parse(sessionStorage.getItem(this.constants.AGENT_UNDER_PLAN_DATA));
    if (!this.agentsUnderPlan) {
      this.agentsUnderPlan = [];
      makeServerRequest(this);
    }
    else {
      this.pageNumber = Number(sessionStorage.getItem(this.constants.AGENT_UNDER_PLAN_CURRENT_PAGE_NO));
      this.totalRows = Number(sessionStorage.getItem(this.constants.AGENT_UNDER_PLAN_TOTAL_ROWS));
      this.renderUI();
    }
  }

  updateRatioUI() {
    this.totalAndCurrentRowsRatio = this.commonFunctions.showMoreDataSnackbar(this.agentsUnderPlan, this.totalRows);
    this.cdr.markForCheck();
  }

  checkMoreDataAvailable() {
    if (!this.agentsUnderPlan || this.agentsUnderPlan.length == this.totalRows)
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
function makeServerRequest(context: AgentUnderPlanComponent) {
  context.pageNumber++;
  context.apiHandler.getTopAgents(context.pageNumber, context);
}

function refreshData(context: AgentUnderPlanComponent) {
  context.pageNumber = 0;
  context.agentsUnderPlan = [];
  makeServerRequest(context);
}
