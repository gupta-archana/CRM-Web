import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { EntityModel } from '../../../models/entity-model';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { ThirteenMonthModel } from '../../../models/thirteen-month-model';

@Component({
  selector: 'app-agent-thirteen-month-activity',
  templateUrl: './agent-thirteen-month-activity.component.html',
  styleUrls: ['./agent-thirteen-month-activity.component.css']
})
export class AgentThirteenMonthActivityComponent extends BaseClass implements OnInit, ApiResponseCallback {

  monthsName: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  entityModel: EntityModel;
  thirteenMonthsModels: ThirteenMonthModel[] = new Array<ThirteenMonthModel>();
  constructor(private injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.entityModel = JSON.parse(sessionStorage.getItem(this.constants.ENTITY_INFO));
    makeServerRequest(this);
  }
  goBack() {
    this.commonFunctions.backPress();
  }

  onRecentProfileClick() {
    this.dataService.onRecentProfileClick();
  }

  getMonth(item: ThirteenMonthModel) {
    return this.monthsName[Number(item.month) - 1];
  }

  onSuccess(response: any) {
    this.thirteenMonthsModels = response.activitymonth.reverse();
    this.cdr.markForCheck();
  }
  onError(errorCode: number, errorMsg: string) {
    this.commonFunctions.showErrorSnackbar(errorMsg);
  }
}

function makeServerRequest(context: AgentThirteenMonthActivityComponent) {
  context.apiHandler.getThirteenMonthActivity(context.entityModel.entityId, context);
}
