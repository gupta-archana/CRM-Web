import { Component, OnInit } from '@angular/core';
import { AgentInfoModel } from 'src/app/models/TopAgentsModel';
import { CommonFunctionsService } from 'src/app/utils/common-functions.service';
import { Router } from '@angular/router';
import { MyLocalStorageService } from 'src/app/services/my-local-storage.service';
import { Constants } from 'src/app/Constants/Constants';
import * as paths from 'src/app/Constants/paths';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { ApiHandlerService } from '../../../utils/api-handler.service';

@Component({
  selector: 'app-top-agents',
  templateUrl: './top-agents.component.html',
  styleUrls: ['./top-agents.component.css']
})
export class TopAgentsComponent implements OnInit, ApiResponseCallback {

  pageNumber: number = 0;
  emailId: string;
  encryptedPassword: string;

  constructor(private commonFunctions: CommonFunctionsService,
    private router: Router,
    private myLocalStorage: MyLocalStorageService,
    private constants: Constants,
    public apiHandler: ApiHandlerService) { this.pageNumber = 0; }
  topAgents: Array<AgentInfoModel> = [];
  ngOnInit() {

    this.addAgents();
    this.emailId = this.myLocalStorage.getValue(this.constants.EMAIL);
    this.encryptedPassword = this.commonFunctions.getEncryptedPassword(this.myLocalStorage.getValue(this.constants.PASSWORD));
    getTopAgents(this);
  }

  onAgentClick(agent: AgentInfoModel) {
    this.commonFunctions.printLog(agent, true);
    this.myLocalStorage.setValue(this.constants.AGENT_INFO, JSON.stringify(agent));
    this.commonFunctions.navigateWithoutReplaceUrl(paths.PATH_AGENT_DETAIL);

  }


  private addAgents() {
    for (let index = 0; index < 10; index++) {
      var topagentModel: AgentInfoModel = new AgentInfoModel();
      topagentModel.agentImg = "../../../../images/placeholder.png";
      topagentModel.agentAddress = "Las Vegas, NV";
      topagentModel.agentName = "NETCO. Inc";
      topagentModel.agentNetPremium = "$15,595 (93%)";
      this.topAgents.push(topagentModel);
    }
  }

  onSuccess(response: any) {
    this.commonFunctions.printLog(response, true);
    //throw new Error("Method not implemented.");
  }
  onError(errorCode: number, errorMsg: string) {
    //throw new Error("Method not implemented.");
  }

}

function getTopAgents(context: TopAgentsComponent) {
  context.pageNumber++;
  context.apiHandler.getTopAgents(context.emailId, context.encryptedPassword, context.pageNumber, context);
}
