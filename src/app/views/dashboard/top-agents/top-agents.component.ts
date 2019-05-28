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


  pageNumber: number = 0;
  emailId: string;
  encryptedPassword: string;
  moreDataAvailable: boolean = true;
  pageRefreshSubscription: Subscription = null;
  totalRows: number = 0;
  totalAndCurrentRowsRatio: string = "";

  constructor(private injector: Injector, private commonApis: CommonApisService) {
    super(injector);
    this.pageNumber = 0;
    this.totalRows = 0;
  }
  topAgents: Array<EntityModel> = [];

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
    hitApi(this);
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
      this.pageNumber = Number(sessionStorage.getItem(this.constants.TOP_AGENT_CURRENT_PAGE_NO));
      this.totalRows = Number(sessionStorage.getItem(this.constants.TOP_AGENT_TOTAL_ROWS));
      this.updateRatioUI();
      this.cdr.markForCheck();
    }
  }

  onAgentClick(agent: EntityModel) {
    sessionStorage.setItem(this.constants.TOP_AGENT_CURRENT_PAGE_NO, this.pageNumber.toString());
    sessionStorage.setItem(this.constants.TOP_AGENT_DATA, JSON.stringify(this.topAgents));
    sessionStorage.setItem(this.constants.AGENT_INFO, JSON.stringify(agent));
    sessionStorage.setItem(this.constants.TOP_AGENT_TOTAL_ROWS, JSON.stringify(this.totalRows));
    this.commonFunctions.navigateWithoutReplaceUrl(this.paths.PATH_AGENT_DETAIL);

  }


  onStarClick(item: EntityModel) {
    this.commonApis.setFavorite(item, this.apiHandler, this.cdr);
  }

  onSuccess(response: any) {
    this.parseAndShowDataOnUi(response);
    this.cdr.markForCheck();
  }


  private parseAndShowDataOnUi(response: any) {
    let newTopAgents = response.profile;
    if (newTopAgents) {
      newTopAgents.forEach(element => {
        if (element.type == this.constants.ENTITY_AGENT) {
          this.topAgents.push(element);
        } else {
          this.totalRows = element.rowNum;
        }
      });
      // = Number((newTopAgents.splice(newTopAgents.length - 1, 1))[0].rowNum);
      this.moreDataAvailable = true;
    }
    else {
      this.moreDataAvailable = false;
    }
    this.updateRatioUI();
  }

  private updateRatioUI() {
    this.commonFunctions.showMoreDataSnackbar(this.topAgents, this.totalRows);
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

    if (this.pageRefreshSubscription && !this.pageRefreshSubscription.closed) {
      this.pageRefreshSubscription.unsubscribe();
    }
  }

}

function hitApi(context: TopAgentsComponent) {
  context.pageNumber++;
  context.apiHandler.getTopAgents(context.pageNumber, context);
}

function refreshData(context: TopAgentsComponent) {
  context.pageNumber = 0;
  context.topAgents = [];
  hitApi(context);
}
