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

}
