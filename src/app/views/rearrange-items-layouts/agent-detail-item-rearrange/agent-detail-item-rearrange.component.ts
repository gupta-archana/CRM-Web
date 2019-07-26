import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from 'src/app/global/base-class';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
@Component({
  selector: 'app-agent-detail-item-rearrange',
  templateUrl: './agent-detail-item-rearrange.component.html',
  styleUrls: ['./agent-detail-item-rearrange.component.css']
})
export class AgentDetailItemRearrangeComponent extends BaseClass implements OnInit, ApiResponseCallback {
  agentDetailItems = [];
  constructor(private injector: Injector) { super(injector) }

  ngOnInit() {
    getAgentDetailItems(this);
  }
  onSort(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.agentDetailItems, event.previousIndex, event.currentIndex);

  }

  Save() {
    let itemsInString = JSON.stringify(this.agentDetailItems);
    this.myLocalStorage.setValue(this.constants.AGENT_DETAIL_ITEMS, itemsInString);
    itemsInString = itemsInString.replace(/"/g, "'");
    this.commonApis.updateBasicConfig(this.constants.HOME_MODULE, itemsInString, this);
    this.utils.getAgentDetailItems();
  }
  onSuccess(response: any) {
    this.commonFunctions.backPress();
  }
  onError(errorCode: number, errorMsg: string) {

  }
}
function getAgentDetailItems(self: AgentDetailItemRearrangeComponent) {

  self.utils.getAgentDetailItems().subscribe(data => {
    console.log("data " + JSON.stringify(data));
    if (data)
      self.agentDetailItems = data;
    self.cdr.markForCheck();
  });
}
