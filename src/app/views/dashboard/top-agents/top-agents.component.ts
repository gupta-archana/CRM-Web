import { Component, OnInit, ChangeDetectorRef, HostListener, OnDestroy } from '@angular/core';
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

@Component({
  selector: 'app-top-agents',
  templateUrl: './top-agents.component.html',
  styleUrls: ['./top-agents.component.css']
})
export class TopAgentsComponent implements OnInit, ApiResponseCallback, OnDestroy {


  pageNumber: number = 0;
  emailId: string;
  encryptedPassword: string;
  moreDataAvailable: boolean = true;

  constructor(private commonFunctions: CommonFunctionsService,
    private router: Router,
    private myLocalStorage: MyLocalStorageService,
    private constants: Constants,
    public apiHandler: ApiHandlerService,
    private cdr: ChangeDetectorRef,
  ) {
    this.pageNumber = 0;

  }
  topAgents: Array<any> = [];

  ngOnInit() {

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
    this.myLocalStorage.setValue(this.constants.AGENT_INFO, JSON.stringify(agent));
    this.commonFunctions.navigateWithoutReplaceUrl(paths.PATH_AGENT_DETAIL);

  }



  onSuccess(response: any) {
    this.commonFunctions.printLog(response, true);
    let newTopAgents = response.ttTopAgent;
    if (newTopAgents) {
      this.topAgents = this.topAgents.concat(response.ttTopAgent);
      this.cdr.markForCheck();
    }
    else {
      this.moreDataAvailable = false;
    }
    console.log(this.topAgents[0].name);
  }
  onError(errorCode: number, errorMsg: string) {

  }
  ngOnDestroy(): void {
    sessionStorage.setItem(this.constants.TOP_AGENT_CURRENT_PAGE_NO, this.pageNumber.toString());
    sessionStorage.setItem(this.constants.TOP_AGENT_DATA, JSON.stringify(this.topAgents));
  }

}

function getTopAgents(context: TopAgentsComponent) {
  context.pageNumber++;
  context.apiHandler.getTopAgents(context.emailId, context.encryptedPassword, context.pageNumber, context);
}
