import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-drawer-items-rearrange',
  templateUrl: './drawer-items-rearrange.component.html',
  styleUrls: ['./drawer-items-rearrange.component.css']
})
export class DrawerItemsRearrangeComponent extends BaseClass implements OnInit {
  sideNavArray = [];
  constructor(private injector: Injector) { super(injector) }

  ngOnInit() {
    getSideNavData(this);
  }
  onSort(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.sideNavArray, event.previousIndex, event.currentIndex);

  }

  Save() {
    this.myLocalStorage.setValue(this.constants.SIDE_NAV_ITEMS, JSON.stringify(this.sideNavArray));
    this.utils.getSideNavItems();
    this.commonFunctions.showSnackbar("Saved Successfull");
    this.commonFunctions.backPress();
  }
}
function getSideNavData(self: DrawerItemsRearrangeComponent) {

  self.utils.getSideNavItems().subscribe(data => {
    console.log("data " + JSON.stringify(data));
    if (data)
      self.sideNavArray = data;
    self.cdr.markForCheck();
  });
}
