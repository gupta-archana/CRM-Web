import { Component, OnInit, ChangeDetectorRef, HostListener, OnDestroy, Injector } from '@angular/core';
import { AgentInfoModel } from 'src/app/models/TopAgentsModel';

import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';

import { Subscription } from 'rxjs';
import { BaseClass } from '../../../global/base-class';
import { EntityModel } from '../../../models/entity-model';
import { CommonApisService } from '../../../utils/common-apis.service';

@Component({
  selector: 'app-top-agents',
  templateUrl: './top-agents.component.html',
  styleUrls: ['./top-agents.component.css']
})
export class TopAgentsComponent extends BaseClass implements OnInit, ApiResponseCallback, OnDestroy {
  emailId: string;
  encryptedPassword: string;
  pageRefreshSubscription: Subscription = null;
  pageNumber: number = 0;
  totalRows: any = 0;
  moreDataAvailable: boolean = false;
  totalAndCurrentRowsRatio: string = "";

  constructor(private injector: Injector) {
    super(injector);
    this.pageNumber = 0;
    this.totalRows = 0;
  }
  topAgents: Array<EntityModel> = [];

  ngOnInit() {
    this.commonFunctions.hideShowTopScrollButton(document);
    this.pageRefreshSubscription = this.dataService.pageRefreshObservable.subscribe(called => {
      if (called)
        refreshData(this);
    });
  }
  ngAfterContentInit() {
    this.getTopAgents();
  }

  onLoadMoreClick() {
    hitApi(this);
  }

  onAgentClick(agent: EntityModel) {
    sessionStorage.setItem(this.constants.ENTITY_INFO, JSON.stringify(agent));
    setData(this);
    this.commonFunctions.navigateWithoutReplaceUrl(this.paths.PATH_AGENT_DETAIL);
  }



  private getTopAgents() {
    this.emailId = this.myLocalStorage.getValue(this.constants.EMAIL);
    this.encryptedPassword = this.commonFunctions.getEncryptedPassword(this.myLocalStorage.getValue(this.constants.PASSWORD));
    this.topAgents = JSON.parse(sessionStorage.getItem(this.constants.TOP_AGENT_DATA));
    if (!this.topAgents) {
      this.topAgents = [];
      hitApi(this);
    }
    else {
      getData(this);
    }
  }


  checkEntityFavorite(item: EntityModel) {
    return !this.commonFunctions.checkFavorite(item.entityId);
  }

  onStarClick(item: EntityModel) {
    this.commonApis.setFavorite(item, this.apiHandler, this.cdr).asObservable().subscribe(data => {
      this.renderUI();
    });;
  }

  onSuccess(response: any) {
    this.parseAndShowDataOnUi(response);
    this.cdr.markForCheck();
  }

  onError(errorCode: number, errorMsg: string) {
    this.commonFunctions.showErrorSnackbar(errorMsg)
    this.renderUI();
  }

  private parseAndShowDataOnUi(response: any) {
    let newTopAgents = response.profile;
    if (newTopAgents) {
      newTopAgents.forEach(element => {
        if (element.type == this.constants.ENTITY_AGENT_PRESENTER) {
          this.commonFunctions.setFavoriteOnApisResponse(element);
          this.topAgents.push(element);
        } else {
          this.totalRows = element.rowNum;
        }
      });
    }
    this.renderUI();
  }

  public renderUI() {
    setData(this);
    updateRatioUI(this);
    checkMoreDataAvailable(this);
    this.cdr.markForCheck();
  }
  getAddress(item: EntityModel) {
    return this.commonFunctions.getAddress(item);
  }

  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  ngOnDestroy(): void {

    if (this.pageRefreshSubscription && !this.pageRefreshSubscription.closed) {
      this.pageRefreshSubscription.unsubscribe();
    }
  }

}

function hitApi(context: TopAgentsComponent) {
  context.pageNumber++;
  context.apiHandler.getTopAgents(context.pageNumber, context);
}


function setData(context: TopAgentsComponent) {
  sessionStorage.setItem(context.constants.TOP_AGENT_CURRENT_PAGE_NO, context.pageNumber.toString());
  sessionStorage.setItem(context.constants.TOP_AGENT_DATA, JSON.stringify(context.topAgents));
  sessionStorage.setItem(context.constants.TOP_AGENT_TOTAL_ROWS, context.totalRows);
}

function getData(context: TopAgentsComponent) {
  context.pageNumber = Number(sessionStorage.getItem(context.constants.TOP_AGENT_CURRENT_PAGE_NO));
  context.totalRows = Number(sessionStorage.getItem(context.constants.TOP_AGENT_TOTAL_ROWS));
  context.renderUI();

}

function checkMoreDataAvailable(context: TopAgentsComponent) {
  if ((!context.topAgents && context.topAgents.length == 0) || context.topAgents.length >= context.totalRows)
    context.moreDataAvailable = false;
  else
    context.moreDataAvailable = true;
}

function updateRatioUI(context: TopAgentsComponent) {
  context.totalAndCurrentRowsRatio = context.commonFunctions.showMoreDataSnackbar(context.topAgents, context.totalRows);
  context.cdr.markForCheck();
}

function refreshData(context: TopAgentsComponent) {
  context.pageNumber = 0;
  context.topAgents = [];
  hitApi(context);
}
