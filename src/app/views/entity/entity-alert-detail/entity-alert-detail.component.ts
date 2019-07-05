import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { OpenAlertsModel } from '../../../models/Open-Alerts-model';
import { Subscription } from 'rxjs';
import { EntityModel } from '../../../models/entity-model';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';

@Component({
  selector: 'app-entity-alert-detail',
  templateUrl: './entity-alert-detail.component.html',
  styleUrls: ['./entity-alert-detail.component.css']
})
export class EntityAlertDetailComponent extends BaseClass implements OnInit, OnDestroy, ApiResponseCallback {


  constructor(private injector: Injector) { super(injector) }
  openAlertModel: OpenAlertsModel = new OpenAlertsModel();
  openAlertSubscription: Subscription;
  entityModel: EntityModel;
  ngOnInit() {
    this.entityModel = JSON.parse(sessionStorage.getItem(this.constants.ENTITY_INFO));
    this.openAlertModel = JSON.parse(sessionStorage.getItem(this.constants.SELECTED_ALERT));

  }
  goBack() {
    this.commonFunctions.backPress();
  }

  onSuccess(response: any) {
    this.commonFunctions.showSnackbar(response);
  }
  onError(errorCode: number, errorMsg: string) {
    this.commonFunctions.showSnackbar(errorMsg);
  }


  onMarkAsReviewedClick() {
    if (!JSON.parse(this.myLocalStorage.getValue(this.constants.DONT_SHOW_MARK_REVIED_DIALOG))) {
      let self = this;
      this.openDialogService.showMarkAsReviewedDialog().afterClosed().subscribe(reviewed => {
        if (reviewed) {
          self.apiHandler.MarkAsReviewedAlert(self.openAlertModel.alertID, self);
        }
      });
    }
  }


  ngOnDestroy(): void {
    if (this.openAlertSubscription && !this.openAlertSubscription.closed) {
      this.openAlertSubscription.unsubscribe();
    }
  }
}


