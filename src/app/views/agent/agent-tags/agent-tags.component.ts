import { Component, OnInit, Injector, ChangeDetectionStrategy } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { TagModel } from '../../../models/tag-model';
import { EntityModel } from '../../../models/entity-model';

@Component({
  selector: 'app-agent-tags',
  templateUrl: './agent-tags.component.html',
  styleUrls: ['./agent-tags.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgentTagsComponent extends BaseClass implements OnInit, ApiResponseCallback {

  constructor(private injector: Injector) { super(injector) }
  tags: Array<TagModel> = [];
  entityModel: EntityModel;
  hideNoDataDiv: boolean = false;
  errorMsg: string = "";
  newTag: string = "";
  ngOnInit() {
    this.entityModel = JSON.parse(sessionStorage.getItem(this.constants.ENTITY_INFO));
    updateRatioUI(this);
    getTags(this);
  }

  goBack() {
    this.commonFunctions.backPress();
  }

  onSuccess(response: any) {
    this.hideNoDataDiv = true;
    this.tags = response.tag;
    this.errorMsg = "";
    this.cdr.markForCheck();
  }
  onError(errorCode: number, errorMsg: string) {
    this.hideNoDataDiv = false;
    this.errorMsg = errorMsg;
    this.cdr.markForCheck();
  }

  onTagClick(item: TagModel) {
    let params = { selectedTag: item.name }
    this.commonFunctions.navigateWithParams(this.paths.PATH_ASSOCIATED_AGENTS, params);
  }
  onCreateTagClick() {
    if (this.newTag.length > 0) {
      createTag(this);
    } else {
      this.commonFunctions.showErrorSnackbar("Please enter some tag in field");
    }
  }
}
function getTags(context: AgentTagsComponent) {
  context.apiHandler.getTags(context.entityModel.type, context.entityModel.entityId, context);
}


function createTag(context: AgentTagsComponent) {

  context.apiHandler.createTags(createJsonForAddTag(context), {
    onSuccess(response) {
      context.commonFunctions.showSnackbar(response);
      context.newTag = "";
      getTags(context);
    }, onError(errorCode, errorMsg) {
      context.commonFunctions.showErrorSnackbar(errorMsg);
    }
  })

}

function updateRatioUI(context: AgentTagsComponent) {
  context.commonFunctions.showLoadedItemTagOnHeader(new Array, 0);
  context.cdr.markForCheck();
}

function createJsonForAddTag(context: AgentTagsComponent) {
  if (!context.newTag.startsWith('#'))
    context.newTag = "#" + context.newTag;
  let requestBody = {
    tagID: "",
    entity: context.entityModel.type,
    entityID: context.entityModel.entityId,
    uid: context.myLocalStorage.getValue(context.constants.EMAIL),
    name: context.newTag, private: "no"
  }
  let finalJson = {
    "tag": "",
    "attr": requestBody
  }
  return finalJson;
}