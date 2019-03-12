import { Component, OnInit } from '@angular/core';
import { AgentInfoModel } from 'src/app/models/TopAgentsModel';
import { CommonFunctionsService } from 'src/app/utils/common-functions.service';
import { Router } from '@angular/router';
import { MyLocalStorageService } from 'src/app/services/my-local-storage.service';
import { Constants } from 'src/app/Constants/Constants';
import * as paths from 'src/app/Constants/paths';

@Component({
  selector: 'app-top-agents',
  templateUrl: './top-agents.component.html',
  styleUrls: ['./top-agents.component.css']
})
export class TopAgentsComponent implements OnInit {

  constructor(private commonFunctions: CommonFunctionsService,
    private router: Router,
    private myLocalStorage: MyLocalStorageService,
    private constants: Constants) { }
  topAgents: Array<AgentInfoModel> = [];
  ngOnInit() {

    this.addAgents();
  }

  onAgentClick(agent: AgentInfoModel) {
    this.commonFunctions.printLog(agent, true);
    this.myLocalStorage.setValue(this.constants.AGENT_INFO, JSON.stringify(agent));
    this.commonFunctions.navigateWithoutReplaceUrl(paths.PATH_AGENT_DETAIL);

  }


  private addAgents() {
    for (let index = 0; index < 10; index++) {
      var topagentModel: AgentInfoModel = new AgentInfoModel();
      topagentModel.agentImg = "/src/images/placeholder.png";
      topagentModel.agentAddress = "Las Vegas, NV";
      topagentModel.agentName = "NETCO. Inc";
      topagentModel.agentNetPremium = "$15,595 (93%)";
      this.topAgents.push(topagentModel);
    }
  }
}
