import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { EntityModel } from '../../../models/entity-model';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { PersonAgentsModel } from '../../../models/person-agents-model';

@Component({
  selector: 'app-person-agents',
  templateUrl: './person-agents.component.html',
  styleUrls: ['./person-agents.component.css']
})
export class PersonAgentsComponent extends BaseClass implements OnInit, OnDestroy, ApiResponseCallback {

  constructor(injector: Injector) { super(injector); }

  pageNum: number = 0;
  moreDataAvailable: boolean = false;
  totalAndCurrentRowsRatio: string = "";
  entityModel: EntityModel;
  totalRows: any = 0;
  personAgentsModels: Array<PersonAgentsModel> = new Array();

  ngOnInit() {
    this.entityModel = JSON.parse(sessionStorage.getItem(this.constants.ENTITY_INFO));
    makeApiRequest(this);
  }

  onSuccess(response: any) {
    let agents: PersonAgentsModel[] = response.agentperson;
    this.parseResponse(agents);
    this.updateRatioUI();
    checkMoreDataAvailable(this);
  }
  private parseResponse(agents: PersonAgentsModel[]) {
    agents.forEach(element => {
      if (element.name != "TotalAffiliation") {
        this.personAgentsModels.push(element);
      }
      else {
        this.totalRows = element.rowNum;
      }
    });
  }

  onError(errorCode: number, errorMsg: string) {
    this.updateRatioUI();
  }

  onLoadMoreClick() {
    makeApiRequest(this);
  }

  goBack() {
    this.commonFunctions.backPress();
  }
  private updateRatioUI() {
    this.totalAndCurrentRowsRatio = this.commonFunctions.showMoreDataSnackbar(this.personAgentsModels, this.totalRows);
    this.cdr.markForCheck();
  }
  ngOnDestroy(): void {

  }
}
function makeApiRequest(context: PersonAgentsComponent) {
  context.pageNum++;
  context.entityModel.entityId = "1";
  context.apiHandler.getPersonAffiliations(context.entityModel.entityId, context.pageNum, context);
}
function checkMoreDataAvailable(context: PersonAgentsComponent) {
  if (!context.personAgentsModels || context.personAgentsModels.length == context.totalRows)
    context.moreDataAvailable = false;
  else
    context.moreDataAvailable = true;
}
