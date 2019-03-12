import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataServiceService } from 'src/app/services/data-service.service';
import { AgentInfoModel } from 'src/app/models/TopAgentsModel';
import * as paths from 'src/app/Constants/paths';
import { Constants } from 'src/app/Constants/Constants';
import { MyLocalStorageService } from 'src/app/services/my-local-storage.service';
import { Router } from '@angular/router';
import { CommonFunctionsService } from '../../../utils/common-functions.service';


@Component({
  selector: 'app-agent-detail',
  templateUrl: './agent-detail.component.html',
  styleUrls: ['./agent-detail.component.css']
})
export class AgentDetailComponent implements OnInit, OnDestroy {

  agentInfoSubscription: Subscription = null;
  agentInfo: AgentInfoModel;

  constructor(private dataService: DataServiceService,
    private constants: Constants,
    private myLocalStorage: MyLocalStorageService,
    private commonFunctions: CommonFunctionsService,
    private router: Router) {


  }

  ngOnInit() {
    this.agentInfo = JSON.parse(this.myLocalStorage.getValue(this.constants.AGENT_INFO));
    //this.dataService.sendCurrentPagePath(paths.PATH_AGENT_DETAIL);
  }
  contactDetailClick() {
    this.commonFunctions.navigateWithoutReplaceUrl(paths.PATH_AGENT_CONTACT_DETAIL);
  }
  ngOnDestroy(): void {

  }

}
