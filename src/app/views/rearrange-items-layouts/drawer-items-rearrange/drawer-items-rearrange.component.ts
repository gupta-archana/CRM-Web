import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';

@Component({
  selector: 'app-drawer-items-rearrange',
  templateUrl: './drawer-items-rearrange.component.html',
  styleUrls: ['./drawer-items-rearrange.component.css']
})
export class DrawerItemsRearrangeComponent extends BaseClass implements OnInit, ApiResponseCallback {

  sideNavArray = [];
  constructor(private injector: Injector) { super(injector) }
  public disableSave = true;


  ngOnInit() {
    getSideNavData(this);
  }

  onSort(event: CdkDragDrop<any[]>, rearrangeItem: boolean) {
    this.disableSave = rearrangeItem;
    moveItemInArray(this.sideNavArray, event.previousIndex, event.currentIndex);
  }

  goBack() {
    this.commonFunctions.backPress();
  }

  Save() {
    let itemsInString = JSON.stringify(this.sideNavArray);
    this.myLocalStorage.setValue(this.constants.SIDE_NAV_ITEMS, itemsInString);
    itemsInString = itemsInString.replace(/"/g, "'");
    this.commonApis.updateBasicConfig(this.constants.HOME_MODULE, itemsInString, this);
    this.utils.getSideNavItems();
    //this.commonFunctions.showSnackbar("Saved Successfull");

  }

  onSuccess(response: any) {
    this.commonFunctions.backPress();
  }
  onError(errorCode: number, errorMsg: string) {

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
