import { Component, OnInit, Injector, ChangeDetectionStrategy } from '@angular/core';
import { CommonFunctionsService } from '../../../utils/common-functions.service';
import { ObjectiveModel } from '../../../models/objective-model';
import { BaseClass } from '../../../global/base-class';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { EntityModel } from '../../../models/entity-model';

@Component({
  selector: 'app-agent-objective',
  templateUrl: './agent-objective.component.html',
  styleUrls: ['./agent-objective.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgentObjectiveComponent extends BaseClass implements OnInit, ApiResponseCallback {


  constructor(private injector: Injector) { super(injector) }
  entityModel: EntityModel;
  objectivesMapArray: Map<string, Array<ObjectiveModel>>;
  agentActiveObjective: ObjectiveModel = null;
  ourActiveObjective: ObjectiveModel = null;
  pageNum: number = 0;
  STATUS_ACTIVE = "A";
  STATUS_ALL = "ALL";
  OBJECTIVE_FOR_OUR = "our";
  OBJECTIVE_FOR_AGENT = "agent";

  ngOnInit() {
    this.entityModel = JSON.parse(sessionStorage.getItem(this.constants.ENTITY_INFO));
    hitApiForActiveStatuses(this);
  }
  goBack() {
    this.commonFunctions.backPress();
  }
  onSuccess(response: any) {

    this.cdr.markForCheck();
  }
  onError(errorCode: number, errorMsg: string) {
    throw new Error("Method not implemented.");
  }
}


function hitApiForActiveStatuses(context: AgentObjectiveComponent) {
  //context.pageNum++;
  //context.apiHandler.getObjectives(context.STATUS_ACTIVE, context.entityModel.type, context.entityModel.entityId, context.OBJECTIVE_FOR_OUR, context.pageNum, context);
  getAgentActiveStatuses(context);
  getOurActiveStatuses(context);
}

function getAgentActiveStatuses(context: AgentObjectiveComponent) {
  context.apiHandler.getObjectives(context.STATUS_ACTIVE, context.entityModel.type, context.entityModel.entityId, context.OBJECTIVE_FOR_AGENT, 1, {
    onSuccess(response) {
      context.agentActiveObjective = response[0];
      context.cdr.markForCheck();
    }, onError(errorCode, errorMsg) {

    }
  });
}
function getOurActiveStatuses(context: AgentObjectiveComponent) {
  context.apiHandler.getObjectives(context.STATUS_ACTIVE, context.entityModel.type, context.entityModel.entityId, context.OBJECTIVE_FOR_OUR, 1, {
    onSuccess(response) {
      context.ourActiveObjective = response[0];
      context.cdr.markForCheck();
    }, onError(errorCode, errorMsg) {

    }
  });
}


