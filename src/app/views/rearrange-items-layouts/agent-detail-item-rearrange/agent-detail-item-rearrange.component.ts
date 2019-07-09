import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from 'src/app/global/base-class';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-agent-detail-item-rearrange',
  templateUrl: './agent-detail-item-rearrange.component.html',
  styleUrls: ['./agent-detail-item-rearrange.component.css']
})
export class AgentDetailItemRearrangeComponent extends BaseClass implements OnInit {
  agentDetailItems = [];
  constructor(private injector: Injector) { super(injector) }

  ngOnInit() {
    getAgentDetailItems(this);
  }
  onSort(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.agentDetailItems, event.previousIndex, event.currentIndex);

  }

  Save() {
    this.myLocalStorage.setValue(this.constants.AGENT_DETAIL_ITEMS, JSON.stringify(this.agentDetailItems));
    this.utils.getAgentDetailItems();
    this.commonFunctions.showSnackbar("Saved Successfull");
    this.commonFunctions.backPress();
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
