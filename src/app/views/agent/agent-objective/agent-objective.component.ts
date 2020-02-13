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
  hideEditObjective: boolean = true;
  showingRecents: boolean = false;

  ngOnInit() {
    this.entityModel = JSON.parse(sessionStorage.getItem(this.constants.ENTITY_INFO));
    getAgentActiveStatuses(this);
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
    showHideEditObjective(this);
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
    this.showingRecents = true;
    showHideEditObjective(this);
  }

  showAgentActiveObj() {
    document.getElementById("recentAgentObj").style.display = "none";
    document.getElementById("agentObjective").style.display = "block";
    this.showingRecents = false;
    showHideEditObjective(this);
  }

  showOurRecentObj() {
    document.getElementById("ourObj").style.display = "block";
    document.getElementById("ourObjective").style.display = "none";
    this.showingRecents = true;
    showHideEditObjective(this);
  }

  showOurActiveObj() {
    document.getElementById("ourObj").style.display = "none";
    document.getElementById("ourObjective").style.display = "block";
    this.showingRecents = false;
    showHideEditObjective(this);
  }
  onCompleteClick(item: ObjectiveModel) {
    changeObjectiveStatus(this, item, "C");
  }

  onCancelClick(item: ObjectiveModel) {
    changeObjectiveStatus(this, item, "X");
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
      handleActiveAgentStatusesResponse(context, response);
    }, onError(errorCode, errorMsg) {
      showHideEditObjective(context);
      if (context.agentObjectivesMapArray.size == 0)
        getAllRecentObjectiveForAgent(context);
    }
  });
}

function handleActiveAgentStatusesResponse(context: AgentObjectiveComponent, response) {
  context.agentActiveObjective = response.objective[0];
  showHideEditObjective(context);
  if (context.agentObjectivesMapArray.size == 0)
    getAllRecentObjectiveForAgent(context);
  context.cdr.markForCheck();
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
      handleOurActiveStatusResponse(context, response);
    }, onError(errorCode, errorMsg) {
      showHideEditObjective(context);
      if (context.ourObjectivesMapArray.size == 0)
        getAllRecentObjectiveForOur(context);
    }
  });
}

function handleOurActiveStatusResponse(context: AgentObjectiveComponent, response) {
  context.ourActiveObjective = response.objective[0];
  showHideEditObjective(context);
  if (context.ourObjectivesMapArray.size == 0)
    getAllRecentObjectiveForOur(context);
  context.cdr.markForCheck();
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

function changeObjectiveStatus(context: AgentObjectiveComponent, objectiveModel: ObjectiveModel, status: any) {
  objectiveModel.Stat = status;
  context.apiHandler.updateObjective(createRequestJson(objectiveModel), {
    onSuccess(response) {
      context.commonFunctions.showSnackbar(response);
      updateObjectivesAfterChangeStatus(context);
    }, onError(errorCode, errorMsg) {
      context.commonFunctions.showErrorSnackbar(errorMsg);
    }
  });

}

function createRequestJson(objectiveModel) {
  let finalJson = {
    "objective": "",
    "attr": objectiveModel
  }
  return finalJson;
}

function updateObjectivesAfterChangeStatus(context: AgentObjectiveComponent) {
  if (context.selectedTab == 1) {
    context.agentPageNum = 0;
    context.agentActiveObjective = null;
    context.agentObjectivesMapArray = new Map<string, Array<ObjectiveModel>>();
    context.cdr.markForCheck();
    getAgentActiveStatuses(context);
  }
  else {
    context.ourPageNum = 0;
    context.ourActiveObjective = null;
    context.ourObjectivesMapArray = new Map<string, Array<ObjectiveModel>>();
    context.cdr.markForCheck();
    getOurActiveStatuses(context);
  }
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

function showHideEditObjective(context: AgentObjectiveComponent) {
  if (context.showingRecents) {
    context.hideEditObjective = true;
  }
  else if (context.selectedTab == 1) {
    if (context.agentActiveObjective) {
      context.hideEditObjective = false;
    } else {
      context.hideEditObjective = true;
    }
  } else {
    if (context.ourActiveObjective) {
      context.hideEditObjective = false;
    } else {
      context.hideEditObjective = true;
    }
  }
  context.cdr.markForCheck();
}