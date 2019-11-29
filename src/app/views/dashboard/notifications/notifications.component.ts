import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { NotificationsModel } from '../../../models/notifications-model';
import { onErrorResumeNext } from 'rxjs';
import { EntityModel } from '../../../models/entity-model';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent extends BaseClass implements OnInit {


  constructor(injector: Injector) { super(injector) }

  ngOnInit() {

  }
  onTabSelect(event) {
    this.commonFunctions.printLog(event);
    shareTabIndexToChilds(this, event.index);
  }
}
function shareTabIndexToChilds(context: NotificationsComponent, index: number) {
  context.dataService.onTabSelected(index);
}
