import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { OpenAlertsModel } from '../../../models/Open-Alerts-model';
import { Subscription } from 'rxjs';
import { EntityModel } from '../../../models/entity-model';

@Component({
  selector: 'app-entity-alert-detail',
  templateUrl: './entity-alert-detail.component.html',
  styleUrls: ['./entity-alert-detail.component.css']
})
export class EntityAlertDetailComponent extends BaseClass implements OnInit, OnDestroy {


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
  ngOnDestroy(): void {
    if (this.openAlertSubscription && !this.openAlertSubscription.closed) {
      this.openAlertSubscription.unsubscribe();
    }
  }
}


