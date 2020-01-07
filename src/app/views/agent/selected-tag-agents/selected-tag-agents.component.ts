import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseClass } from 'src/app/global/base-class';
import { ApiResponseCallback } from 'src/app/Interfaces/ApiResponseCallback';
import { EntityModel } from 'src/app/models/entity-model';

@Component({
  selector: 'app-selected-tag-agents',
  templateUrl: './selected-tag-agents.component.html',
  styleUrls: ['./selected-tag-agents.component.css']
})
export class SelectedTagAgentsComponent extends BaseClass implements OnInit, ApiResponseCallback {


  constructor(private injector: Injector, public route: ActivatedRoute) { super(injector) }
  selectedTag: string = "";
  pageNum: number = 0;
  TYPES: string = "ALL";
  entityModel: EntityModel;
  moreDataAvailable: boolean = false;
  agents: Array<EntityModel> = new Array<EntityModel>();
  totalRows: number = 0;
  hideNoDataDiv: boolean = false;
  errorMsg: string = "";
  ngOnInit() {
    this.entityModel = JSON.parse(sessionStorage.getItem(this.constants.ENTITY_INFO));
    getTagFromRoute(this);
  }

  checkEntityFavorite(item: EntityModel) {
    return !this.commonFunctions.checkFavorite(item.entityId);
  }

  onStarClick(item: EntityModel) {
    this.commonApis.setFavorite(item, this.apiHandler, this.cdr);
  }


  getAddress(item: EntityModel) {
    return this.commonFunctions.getAddress(item);
  }


  goBack() {
    this.commonFunctions.backPress();
  }
  onSuccess(response: any) {
    parseResponse(response, this);
  }


  onError(errorCode: number, errorMsg: string) {
    updateNoDataAvailableFlag(this);
    this.errorMsg = errorMsg;
    this.cdr.markForCheck();
  }
}
function getTagFromRoute(context: SelectedTagAgentsComponent) {
  context.route.queryParams
    .subscribe(params => {
      context.selectedTag = params['selectedTag'];
      if (context.selectedTag.startsWith('#'))
        context.selectedTag = context.selectedTag.substr(1, context.selectedTag.length);
      hitApi(context);
    });
}

function hitApi(context: SelectedTagAgentsComponent) {
  context.pageNum++;

  context.apiHandler.getAssociatedAgentFromTag(context.selectedTag, context.TYPES, context.entityModel.type, context.entityModel.entityId, context.pageNum, context);
}


function parseResponse(response: any, context: SelectedTagAgentsComponent) {
  let tempAgents: Array<EntityModel> = response.profile;
  tempAgents.forEach(element => {
    if (element.type != "TotalMatch")
      context.agents.push(element);
    else
      context.totalRows = Number(element.rowNum);
  });

  checkMoreDataAvailable(context);
  updateNoDataAvailableFlag(context);

}

function updateNoDataAvailableFlag(context: SelectedTagAgentsComponent) {
  if (context.agents && context.agents.length > 0) {
    context.hideNoDataDiv = true
  } else
    context.hideNoDataDiv = false;
  updateRatioUI(context);
}

function checkMoreDataAvailable(context: SelectedTagAgentsComponent) {
  if ((!context.agents && context.agents.length == 0) || context.agents.length >= context.totalRows)
    context.moreDataAvailable = false;
  else
    context.moreDataAvailable = true;
}
function updateRatioUI(context: SelectedTagAgentsComponent) {
  context.commonFunctions.showLoadedItemTagOnHeader(context.agents, context.totalRows);
  context.cdr.markForCheck();
}


