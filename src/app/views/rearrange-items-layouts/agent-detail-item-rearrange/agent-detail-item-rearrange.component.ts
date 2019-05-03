import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from 'src/app/global/base-class';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-agent-detail-item-rearrange',
  templateUrl: './agent-detail-item-rearrange.component.html',
  styleUrls: ['./agent-detail-item-rearrange.component.css']
})
export class AgentDetailItemRearrangeComponent extends BaseClass implements OnInit {
  sideNavArray = [];
  constructor(private injector: Injector) { super(injector) }

  ngOnInit() {
    getAgentDetailItems(this);
  }
  onSort(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.sideNavArray, event.previousIndex, event.currentIndex);

  }

  private Save() {
    this.myLocalStorage.setValue(this.constants.SIDE_NAV_ITEMS, JSON.stringify(this.sideNavArray));
    this.commonFunctions.getSideNavItems();
    this.commonFunctions.showSnackbar("Saved Successfull");
    this.commonFunctions.backPress();
  }
}
function getAgentDetailItems(self: AgentDetailItemRearrangeComponent) {

  self.commonFunctions.getAgentDetailItems().subscribe(data => {
    console.log("data " + JSON.stringify(data));
    if (data)
      self.sideNavArray = data;
    self.cdr.markForCheck();
  });
}
