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
    this.apiHandler.getTags(this.entityModel.type, this.entityModel.entityId, this);
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
  onCreateTagClick() {
    if (this.newTag.length > 0) {
      createTag(this);
    } else {
      this.commonFunctions.showErrorSnackbar("Please enter some tag in field");
    }
  }
}


function createTag(context: AgentTagsComponent) {

  context.apiHandler.createTags(createJsonForAddTag(context), {
    onSuccess(response) {
      context.commonFunctions.showSnackbar(response);
    }, onError(errorCode, errorMsg) {

    }
  })

}
function createJsonForAddTag(context: AgentTagsComponent) {
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
