import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { EntityModel } from '../../../models/entity-model';
import { ObjectiveModel } from '../../../models/objective-model';

@Component({
  selector: 'app-agent-objective',
  templateUrl: './agent-objective.component.html',
  styleUrls: ['./agent-objective.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgentObjectiveComponent extends BaseClass implements OnInit, ApiResponseCallback {


  constructor(private injector: Injector) { super(injector); }
  entityModel: EntityModel;
  agentObjectivesMapArray: Map<string, Array<ObjectiveModel>> = new Map<string, Array<ObjectiveModel>>();
  ourObjectivesMapArray: Map<string, Array<ObjectiveModel>> = new Map<string, Array<ObjectiveModel>>();
  agentActiveObjective: ObjectiveModel = null;
  ourActiveObjective: ObjectiveModel = null;
  agentPageNum = 0;
  ourPageNum = 0;
  selectedTab: number = 1;

  totalAgentObjective: number = 0;
  totalOurObjective: number = 0;

  STATUS_ACTIVE = 'A';
  STATUS_ALL = 'ALL';
  OBJECTIVE_FOR_OUR = 'O';
  OBJECTIVE_FOR_AGENT = 'T';
  showingOtherThanActiveObjectives: boolean = false;

  ngOnInit() {
    this.entityModel = JSON.parse(sessionStorage.getItem(this.constants.ENTITY_INFO));
    getAgentActiveStatuses(this);
    //getAllRecentObjectiveForAgent(this);
  }
  goBack() {
    if (this.selectedTab == 1) {
      if (document.getElementById("recentAgentObj").style.display == "block") {
        this.showAgentActiveObj();
        return;
      }

    }
    else {
      if (document.getElementById("ourObj").style.display == "block") {
        this.showOurActiveObj();
        return;
      }

    }

    this.commonFunctions.backPress();
  }

  onTabClick(tabNumber: number) {
    this.selectedTab = tabNumber;
    if (tabNumber == 1) {
      if (!this.agentActiveObjective) {
        getAgentActiveStatuses(this);
      }

    } else if (tabNumber == 2) {
      if (!this.ourActiveObjective) {
        getOurActiveStatuses(this);
      }
    }
  }

  onSuccess(response: any) {
    this.cdr.markForCheck();
  }
  onError(errorCode: number, errorMsg: string) {

  }

  showAgentRecentObj() {
    document.getElementById("recentAgentObj").style.display = "block";
    document.getElementById("agentObjective").style.display = "none";
    this.showingOtherThanActiveObjectives = true;
  }

  showAgentActiveObj() {
    document.getElementById("recentAgentObj").style.display = "none";
    document.getElementById("agentObjective").style.display = "block";
    this.showingOtherThanActiveObjectives = false;
  }

  showOurRecentObj() {
    document.getElementById("ourObj").style.display = "block";
    document.getElementById("ourObjective").style.display = "none";
    this.showingOtherThanActiveObjectives = true;
  }

  showOurActiveObj() {
    document.getElementById("ourObj").style.display = "none";
    document.getElementById("ourObjective").style.display = "block";
    this.showingOtherThanActiveObjectives = false;
  }


  openEditObjectiveDialog() {
    if (this.selectedTab == 1) {
      this.openDialogService.showEditObjectiveDialog(JSON.stringify(this.agentActiveObjective)).afterClosed().subscribe(updated => {
        if (updated)
          getAgentActiveStatuses(this);
      });
    } else if (this.selectedTab == 2) {
      this.openDialogService.showEditObjectiveDialog(JSON.stringify(this.ourActiveObjective)).afterClosed().subscribe(updated => {
        if (updated)
          getOurActiveStatuses(this);
      });
    }
  }
}




function getAgentActiveStatuses(context: AgentObjectiveComponent) {
  context.apiHandler.getActiveObjectives(context.STATUS_ACTIVE, context.entityModel.type,
    context.entityModel.entityId, context.OBJECTIVE_FOR_AGENT, 1, {
    onSuccess(response) {
      context.agentActiveObjective = response.objective[0];
      getAllRecentObjectiveForAgent(context);
      context.cdr.markForCheck();
    }, onError(errorCode, errorMsg) {

    }
  });
}

function getAllRecentObjectiveForAgent(context: AgentObjectiveComponent) {
  context.agentPageNum++;
  context.apiHandler.getObjectives(context.STATUS_ALL, context.entityModel.type,
    context.entityModel.entityId, context.OBJECTIVE_FOR_AGENT, context.agentPageNum, {
    onSuccess(response) {
      context.agentObjectivesMapArray = parseRecentObjectivesResponse(context, false, response);
      context.cdr.markForCheck();
    }, onError(errorCode, errorMsg) {

    }
  });
}

function getOurActiveStatuses(context: AgentObjectiveComponent) {
  context.apiHandler.getActiveObjectives(context.STATUS_ACTIVE, context.entityModel.type,
    context.entityModel.entityId, context.OBJECTIVE_FOR_OUR, 1, {
    onSuccess(response) {
      context.ourActiveObjective = response.objective[0];
      getAllRecentObjectiveForOur(context);
      context.cdr.markForCheck();
    }, onError(errorCode, errorMsg) {

    }
  });
}

function getAllRecentObjectiveForOur(context: AgentObjectiveComponent) {
  context.ourPageNum++;
  context.apiHandler.getObjectives(context.STATUS_ALL, context.entityModel.type,
    context.entityModel.entityId, context.OBJECTIVE_FOR_OUR, context.ourPageNum, {
    onSuccess(response) {
      context.ourObjectivesMapArray = parseRecentObjectivesResponse(context, true, response);
      context.cdr.markForCheck();
    }, onError(errorCode, errorMsg) {

    }
  });
}

function parseRecentObjectivesResponse(context: AgentObjectiveComponent, ourObjective: boolean, response) {
  let recentMap: Map<string, Array<ObjectiveModel>> = new Map<string, Array<ObjectiveModel>>();
  let objectives: Array<ObjectiveModel> = response.objective;
  objectives.forEach(element => {
    if (element.description == 'TotalObjectives') {
      if (ourObjective)
        context.totalOurObjective = Number(element.type);
      else
        context.totalAgentObjective = Number(element.type);
    } else {
      addItemToMap(element, recentMap);
    }
  });
  return recentMap;
}
function addItemToMap(element: ObjectiveModel, recentMap: Map<string, ObjectiveModel[]>) {
  let key: string = element.dueDate;
  let objectivesArrayForDate = recentMap.get(key);
  if (!objectivesArrayForDate)
    objectivesArrayForDate = Array<ObjectiveModel>();
  objectivesArrayForDate.push(element);
  recentMap.set(key, objectivesArrayForDate);
}

