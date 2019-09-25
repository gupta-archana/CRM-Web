import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-person-detail-items-rearrange',
  templateUrl: './person-detail-items-rearrange.component.html',
  styleUrls: ['./person-detail-items-rearrange.component.css']
})
export class PersonDetailItemsRearrangeComponent extends BaseClass implements OnInit, ApiResponseCallback {
  personDetailItems = [];
  constructor(private injector: Injector) { super(injector) }

  ngOnInit() {
    getAgentDetailItems(this);
  }
  onSort(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.personDetailItems, event.previousIndex, event.currentIndex);

  }
  goBack() {
    this.commonFunctions.backPress();
  }
  Save() {
    let itemsInString = JSON.stringify(this.personDetailItems);
    this.myLocalStorage.setValue(this.constants.PERSON_DETAIL_ITEMS, itemsInString);
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
function getAgentDetailItems(self: PersonDetailItemsRearrangeComponent) {

  self.utils.getPersonDetailItems().subscribe(data => {
    console.log("data " + JSON.stringify(data));
    if (data)
      self.personDetailItems = data;
    self.cdr.markForCheck();
  });
}
