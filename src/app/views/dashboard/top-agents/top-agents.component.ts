import { Component, OnInit, ChangeDetectorRef, HostListener, OnDestroy, Injector } from '@angular/core';
import { AgentInfoModel } from 'src/app/models/TopAgentsModel';
import { CommonFunctionsService } from 'src/app/utils/common-functions.service';
import { Router } from '@angular/router';
import { MyLocalStorageService } from 'src/app/services/my-local-storage.service';
import { Constants } from 'src/app/Constants/Constants';
import * as paths from 'src/app/Constants/paths';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { ApiHandlerService } from '../../../utils/api-handler.service';
import { UserModel } from 'src/app/models/UserModel';
import { DataServiceService } from 'src/app/services/data-service.service';
import { Subscription } from 'rxjs';
import { BaseClass } from '../../../global/base-class';

@Component({
  selector: 'app-top-agents',
  templateUrl: './top-agents.component.html',
  styleUrls: ['./top-agents.component.css']
})
export class TopAgentsComponent extends BaseClass implements OnInit, ApiResponseCallback, OnDestroy {


  pageNumber: number = 0;
  emailId: string;
  encryptedPassword: string;
  moreDataAvailable: boolean = true;
  pageRefreshSubscription: Subscription = null;

  constructor(private injector: Injector) {
    super(injector);
    this.pageNumber = 0;
  }
  topAgents: Array<any> = [];

  ngOnInit() {

    this.commonFunctions.hideShowTopScrollButton();
    this.pageRefreshSubscription = this.dataService.pageRefreshObservable.subscribe(called => {
      if (called)
        refreshData(this);
    });
  }
  ngAfterContentInit() {
    this.getTopAgents();
  }

  onLoadMoreClick() {
    getTopAgents(this);
  }

  private getTopAgents() {
    this.emailId = this.myLocalStorage.getValue(this.constants.EMAIL);
    this.encryptedPassword = this.commonFunctions.getEncryptedPassword(this.myLocalStorage.getValue(this.constants.PASSWORD));
    this.topAgents = JSON.parse(sessionStorage.getItem(this.constants.TOP_AGENT_DATA));
    if (!this.topAgents) {
      this.topAgents = [];

      getTopAgents(this);
    }
    else {
      this.pageNumber = Number(sessionStorage.getItem(this.constants.TOP_AGENT_CURRENT_PAGE_NO));
      this.cdr.markForCheck();
    }
  }

  onAgentClick(agent: AgentInfoModel) {
    this.commonFunctions.printLog(agent, true);
    sessionStorage.setItem(this.constants.AGENT_INFO, JSON.stringify(agent));
    this.commonFunctions.navigateWithoutReplaceUrl(paths.PATH_AGENT_DETAIL);

  }

  onSuccess(response: any) {
    this.commonFunctions.printLog(response, true);
    let newTopAgents = response.ttTopAgent;
    if (newTopAgents) {
      this.topAgents = this.topAgents.concat(response.ttTopAgent);
      this.cdr.markForCheck();
      this.moreDataAvailable = true;
    }
    else {
      this.moreDataAvailable = false;
    }
    console.log(this.topAgents[0].name);
  }
  onError(errorCode: number, errorMsg: string) {
    this.moreDataAvailable = false;
    this.commonFunctions.showErrorSnackbar(errorMsg);
    this.cdr.markForCheck();
  }

  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  ngOnDestroy(): void {
    sessionStorage.setItem(this.constants.TOP_AGENT_CURRENT_PAGE_NO, this.pageNumber.toString());
    sessionStorage.setItem(this.constants.TOP_AGENT_DATA, JSON.stringify(this.topAgents));
    if (this.pageRefreshSubscription && !this.pageRefreshSubscription.closed) {
      this.pageRefreshSubscription.unsubscribe();
    }
  }

}

function getTopAgents(context: TopAgentsComponent) {
  context.pageNumber++;
  context.apiHandler.getTopAgents(context.emailId, context.encryptedPassword, context.pageNumber, context);
}

function refreshData(context: TopAgentsComponent) {
  context.pageNumber = 0;
  context.topAgents = [];
  getTopAgents(context);
}
