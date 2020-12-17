import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit,
} from "@angular/core";
import { Subscription } from "rxjs";
import { BaseClass } from "../../../global/base-class";
import { ApiResponseCallback } from "../../../Interfaces/ApiResponseCallback";
import { EntityModel } from "../../../models/entity-model";
import { ObjectiveModel } from "../../../models/objective-model";
import { SentimentModel } from "../../../models/sentiment-model";
import { DataServiceService } from "../../../services/data-service.service";

@Component({
  selector: "app-agent-objective",
  templateUrl: "./agent-objective.component.html",
  styleUrls: ["./agent-objective.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentObjectiveComponent
  extends BaseClass
  implements OnInit, ApiResponseCallback {
  constructor(
    private injector: Injector,
    public dataService: DataServiceService
  ) {
    super(injector);
  }
  entityModel: EntityModel;
  agentObjectivesMapArray: Map<string, Array<ObjectiveModel>> = new Map<
    string,
    Array<ObjectiveModel>
>();
  ourObjectivesMapArray: Map<string, Array<ObjectiveModel>> = new Map<
    string,
    Array<ObjectiveModel>
  >();
  agentobjectiveModels: ObjectiveModel[] = new Array;
  ourobjectiveModels: ObjectiveModel[] = new Array;
  agentActiveObjective: ObjectiveModel = null;
  ourActiveObjective: ObjectiveModel = null;
  agentActiveSentiment: SentimentModel = null;
  ourActiveSentiment: SentimentModel = null;
  agentPageNum = 1;
  ourPageNum = 1;
  selectedTab: number = 1;
  reloadSubscription: Subscription;
  hideAddEdit: boolean;
  totalAgentObjective: number = 0;
  totalOurObjective: number = 0;
  recentObjectives: Array<ObjectiveModel>;
  STATUS_ACTIVE = "A";
  STATUS_ALL = "ALL";
  OBJECTIVE_FOR_OUR = "O";
  OBJECTIVE_FOR_AGENT = "T";
  hideEditObjective: boolean = true;
  showingRecents: boolean = false;
  pageNumber: number = 0;
  totalRows: any = 0;
  moreDataAvailable: boolean = false;
  objectiveList: any = null;
  agentObjectiveList: any;
  loadMoreClicked:boolean = false;

  ngOnInit() {
    this.entityModel = JSON.parse(
      sessionStorage.getItem(this.constants.ENTITY_INFO)
    );
    reloadObjectiveData(this);
    getAgentActiveStatuses(this);
  }
  onLoadMoreClick() {
    this.loadMoreClicked = true;
    hitApi(this);
    updateRatioUI(this)
  }
  goBack() {
    this.hideAddEdit = false;
  this.commonFunctions.showLoadedItemTagOnHeader(null,null);

    if (this.selectedTab == 1) {
      if (document.getElementById("recentAgentObj").style.display == "block") {
        this.showAgentActiveObj();
        return;
      }
    } else {
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
    this.commonFunctions.showSnackbar(response.message);
  }
  onError(errorCode: number, errorMsg: string) {}

  showAgentRecentObj() {
    this.hideAddEdit = true;
    document.getElementById("recentAgentObj").style.display = "block";
    document.getElementById("agentObjective").style.display = "none";
    this.showingRecents = true;
    showHideEditObjective(this);
    updateRatioUI(this);
  }

  showAgentActiveObj() {
    document.getElementById("recentAgentObj").style.display = "none";
    document.getElementById("agentObjective").style.display = "block";
    this.showingRecents = false;
    showHideEditObjective(this);
  }

  showOurRecentObj() {
    this.hideAddEdit = true;
    document.getElementById("ourObj").style.display = "block";
    document.getElementById("ourObjective").style.display = "none";
    this.showingRecents = true;
    showHideEditObjective(this);
    updateRatioUI(this)
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
  openAddObjectiveDialog() {
    sessionStorage.setItem("tabSelected", this.selectedTab.toString());
    if (this.selectedTab == 1) {
      if (this.agentActiveObjective != null) {
        this.openDialogService.showAddObjectiveDialog(
          JSON.stringify(this.agentActiveObjective)
        );
      } else {
        this.openDialogService
          .showAddObjectiveDialog(JSON.stringify(this.agentActiveObjective))
          .afterClosed()
          .subscribe((updated) => {
            if (updated) getAgentActiveStatuses(this);
          });
      }
    }
    if (this.selectedTab == 2) {
      if (this.ourActiveObjective != null) {
        this.openDialogService.showAddObjectiveDialog(
          JSON.stringify(this.ourActiveObjective)
        );
      } else {
        this.openDialogService
          .showAddObjectiveDialog(JSON.stringify(this.ourActiveObjective))
          .afterClosed()
          .subscribe((updated) => {
            if (updated) getOurActiveStatuses(this);
          });
      }
    }
  }
  openEditObjectiveDialog() {
    if (this.selectedTab == 1) {
      this.openDialogService
        .showEditObjectiveDialog(JSON.stringify(this.agentActiveObjective))
        .afterClosed()
        .subscribe((updated) => {
          if (updated) getAgentActiveStatuses(this);
        });
    } else if (this.selectedTab == 2) {
      this.openDialogService
        .showEditObjectiveDialog(JSON.stringify(this.ourActiveObjective))
        .afterClosed()
        .subscribe((updated) => {
          if (updated) getOurActiveStatuses(this);
        });
    }
  }

  openRecordSentiment(objectiveModel) {
    if (objectiveModel.type === "t" || objectiveModel.type === "T")
      this.openDialogService.showRecordSentimentsDialog(
        JSON.stringify(objectiveModel),
        JSON.stringify(this.agentActiveSentiment)
      );

    if (objectiveModel.type === "o" || objectiveModel.type === "O")
      this.openDialogService.showRecordSentimentsDialog(
        JSON.stringify(objectiveModel),
        JSON.stringify(this.ourActiveSentiment)
      );
  }
}

function getAgentActiveStatuses(context: AgentObjectiveComponent) {
  context.apiHandler.getActiveObjectives(
    context.STATUS_ACTIVE,
    context.entityModel.type,
    context.entityModel.entityId,
    context.OBJECTIVE_FOR_AGENT,
    context.agentPageNum,
    {
      onSuccess(response) {
        handleActiveAgentStatusesResponse(context, response);
      },
      onError(errorCode, errorMsg) {
        showHideEditObjective(context);
        if (context.agentObjectivesMapArray.size == 0)
          getAllRecentObjectiveForAgent(context);
      },
    }
  );
}

function handleActiveAgentStatusesResponse(
  context: AgentObjectiveComponent,
  response
) {
  if (response.name == "objective") {
    context.agentActiveObjective = response.objective[0];
  }

  context.agentActiveObjective = response[0].objective[0];
  context.agentActiveSentiment = response[1].sentiment[0];

  showHideEditObjective(context);
  if (context.agentObjectivesMapArray.size == 0)
    getAllRecentObjectiveForAgent(context);
  context.cdr.markForCheck();
}

function getAllRecentObjectiveForAgent(context: AgentObjectiveComponent) {
  // context.agentPageNum++;
  context.apiHandler.getObjectives(
    context.STATUS_ALL,
    context.entityModel.type,
    context.entityModel.entityId,
    context.OBJECTIVE_FOR_AGENT,
    context.agentPageNum,
    {
      onSuccess(response) {
        context.agentObjectivesMapArray = parseRecentObjectivesResponse(
          context,
          false,
          response
        );
        console.log(context.agentObjectivesMapArray);
        context.cdr.markForCheck();
        if (response.name == "objective") {
          context.objectiveList = response.objective;
        } else {
          context.objectiveList = response[0].objective;
        }

        context.objectiveList.forEach((element) => {
          if (element.description === "TotalObjectives")
            context.totalRows = element.type;
            else
            context.agentobjectiveModels.push(element)
        });
        console.log(context.agentobjectiveModels)
        if(context.loadMoreClicked)
        updateRatioUI(context);

        checkMoreDataAvailable(context);
      },
      onError(errorCode, errorMsg) {},
    }
  );
}

function getOurActiveStatuses(context: AgentObjectiveComponent) {
  context.apiHandler.getActiveObjectives(
    context.STATUS_ACTIVE,
    context.entityModel.type,
    context.entityModel.entityId,
    context.OBJECTIVE_FOR_OUR,
    context.ourPageNum,
    {
      onSuccess(response) {
        handleOurActiveStatusResponse(context, response);
      },
      onError(errorCode, errorMsg) {
        showHideEditObjective(context);
        if (context.ourObjectivesMapArray.size == 0)
          getAllRecentObjectiveForOur(context);
      },
    }
  );
}

function handleOurActiveStatusResponse(
  context: AgentObjectiveComponent,
  response
) {
  if (response.name == "objective") {
    context.ourActiveObjective = response.objective[0];
  } else {
    context.ourActiveObjective = response[0].objective[0];
    context.ourActiveSentiment = response[1].sentiment[0];
  }
  showHideEditObjective(context);
  if (context.ourObjectivesMapArray.size == 0)
    getAllRecentObjectiveForOur(context);
  context.cdr.markForCheck();

}

function getAllRecentObjectiveForOur(context: AgentObjectiveComponent) {
  // context.ourPageNum++;
  context.apiHandler.getObjectives(
    context.STATUS_ALL,
    context.entityModel.type,
    context.entityModel.entityId,
    context.OBJECTIVE_FOR_OUR,
    context.ourPageNum,
    {
      onSuccess(response) {
        context.ourObjectivesMapArray = parseRecentObjectivesResponse(
          context,
          true,
          response
        );
        console.log(context.ourObjectivesMapArray);
        context.cdr.markForCheck();
        if (response.name == "objective") {
          context.objectiveList = response.objective;
        } else {
          context.objectiveList = response[0].objective;
        }

        context.objectiveList.forEach((element) => {
          if (element.description === "TotalObjectives")
            context.totalRows = element.type;
            else
            context.ourobjectiveModels.push(element)
        });
        console.log(context.ourobjectiveModels)
        if(context.loadMoreClicked)
       updateRatioUI(context);
        checkMoreDataAvailable(context);
        
      },
      onError(errorCode, errorMsg) {},
    }
  );
}

function changeObjectiveStatus(
  context: AgentObjectiveComponent,
  objectiveModel: ObjectiveModel,
  status: any
) {
  objectiveModel.Stat = status;
  context.apiHandler.updateObjective(createRequestJson(objectiveModel), {
    onSuccess(response) {
      context.commonFunctions.showSnackbar(response);
      updateObjectivesAfterChangeStatus(context);
    },
    onError(errorCode, errorMsg) {
      context.commonFunctions.showErrorSnackbar(errorMsg);
    },
  });
}

function createRequestJson(objectiveModel) {
  let finalJson = {
    objective: "",
    attr: objectiveModel,
  };
  return finalJson;
}

function updateObjectivesAfterChangeStatus(context: AgentObjectiveComponent) {
  if (context.selectedTab == 1) {
    context.agentPageNum = 0;
    context.agentActiveObjective = null;
    context.agentObjectivesMapArray = new Map<string, Array<ObjectiveModel>>();
    context.cdr.markForCheck();
    getAgentActiveStatuses(context);
  } else {
    context.ourPageNum = 0;
    context.ourActiveObjective = null;
    context.ourObjectivesMapArray = new Map<string, Array<ObjectiveModel>>();
    context.cdr.markForCheck();
    getOurActiveStatuses(context);
  }
}

function parseRecentObjectivesResponse(
  context: AgentObjectiveComponent,ourObjective: boolean,response) {
  let recentMap: Map<string, Array<ObjectiveModel>> = new Map<string,Array<ObjectiveModel>>();

  if (response.objective != undefined && response.objective != null)
    context.recentObjectives = response.objective;
  else context.recentObjectives = response[0].objective;

  context.recentObjectives.forEach((element) => {
    if (element.description == "TotalObjectives") {
      if (ourObjective)
      { context.totalOurObjective = Number(element.type);
      }
      else context.totalAgentObjective = Number(element.type);
    } else {
      addItemToMap(element, recentMap);
    }
  });
  return recentMap;
}

function addItemToMap(element: ObjectiveModel,recentMap: Map<string, ObjectiveModel[]>) {
  let key: string = element.dueDate;
  let objectivesArrayForDate = recentMap.get(key);
  if (!objectivesArrayForDate) objectivesArrayForDate = Array<ObjectiveModel>();
  objectivesArrayForDate.push(element);
  recentMap.set(key, objectivesArrayForDate);
}

function showHideEditObjective(context: AgentObjectiveComponent) {
  if (context.showingRecents) {
    context.hideEditObjective = true;
  } else if (context.selectedTab == 1) {
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

function reloadObjectiveData(context: AgentObjectiveComponent) {
  context.reloadSubscription = context.dataService.getSentimentDataObservable.subscribe(
    (data: any) => {
      console.log(data);
      if (data) {
        if (context.selectedTab == 1) getAgentActiveStatuses(context);
        if (context.selectedTab == 2) getOurActiveStatuses(context);
      }
    }
  );
}
function checkMoreDataAvailable(context: AgentObjectiveComponent) {
  if (context.selectedTab === 1) {
    if (
      (!context.agentobjectiveModels &&
        context.agentobjectiveModels.length == 0) ||
      context.agentobjectiveModels.length >= context.totalRows
    )
      context.moreDataAvailable = false;
    else context.moreDataAvailable = true;
  }
  if (context.selectedTab === 2) {
    if (
      (!context.ourobjectiveModels &&
        context.ourobjectiveModels.length == 0) ||
      context.ourobjectiveModels.length >= context.totalRows
    )
      context.moreDataAvailable = false;
    else context.moreDataAvailable = true;
  }
}
function updateRatioUI(context: AgentObjectiveComponent) 
{ 
  if (context.selectedTab === 1) 
  context.commonFunctions.showLoadedItemTagOnHeader(context.agentobjectiveModels, context.totalRows);
  else if (context.selectedTab === 2)
  context.commonFunctions.showLoadedItemTagOnHeader(context.ourobjectiveModels, context.totalRows);

  //context.totalAndCurrentRowsRatio = context.commonFunctions.showMoreDataSnackbar(context.associatesModels, context.totalRows);
  context.cdr.markForCheck();
}
function hitApi(context: AgentObjectiveComponent) {
  context.agentPageNum++;
  if (context.selectedTab === 1) {
    getAllRecentObjectiveForAgent(context);
  } else {
    context.ourPageNum++;
    getAllRecentObjectiveForOur(context);
  }
}

