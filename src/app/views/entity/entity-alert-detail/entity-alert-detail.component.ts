import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { OpenAlertsModel } from '../../../models/Open-Alerts-model';
import { Subscription } from 'rxjs';
import { EntityModel } from '../../../models/entity-model';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { Constants } from 'src/app/Constants/Constants';
import { EntityAlertComponent } from '../entity-alert/entity-alert.component';

@Component({
    selector: 'app-entity-alert-detail',
    templateUrl: './entity-alert-detail.component.html',
    styleUrls: ['./entity-alert-detail.component.css'],
    providers: [EntityAlertComponent]
})
export class EntityAlertDetailComponent extends BaseClass implements OnInit, OnDestroy, ApiResponseCallback {


    constructor(private injector: Injector, private comp: EntityAlertComponent) {
        super(injector);
    }
    openAlertModel: OpenAlertsModel = new OpenAlertsModel();
    openAlertSubscription: Subscription;
    entityModel: EntityModel;
    public constants: Constants;
    ngOnInit() {
        this.commonFunctions.showLoadedItemTagOnHeader([], "", true);
        this.entityModel = JSON.parse(sessionStorage.getItem(this.constants.ENTITY_INFO));
        this.openAlertModel = JSON.parse(sessionStorage.getItem(this.constants.SELECTED_ALERT));

    }
    goBack() {
        this.commonFunctions.backPress();
        sessionStorage.removeItem(this.constants.ENTITY_ALERTS_ARRAY);
        sessionStorage.removeItem(this.constants.ENTITY_ALERTS_PAGE_NUMBER);
        sessionStorage.removeItem(this.constants.ENTITY_ALERTS_TOTAL_ROWS);
        sessionStorage.removeItem(this.constants.ENTITY_ALERTS_CURRENT_ENTITY_ID);
        this.comp.parentMethod();
    }

    onSuccess(response: any) {
        this.commonFunctions.showSnackbar("Alert" + " " + this.constants.UPDATe_SUCCESS);
    }
    onError(errorCode: number, errorMsg: string) {
        this.commonFunctions.showSnackbar("Alert" + " " + this.constants.UPDATED_FAIL);
    }


    onMarkAsReviewedClick() {
        if (!JSON.parse(this.myLocalStorage.getValue(this.constants.DONT_SHOW_MARK_REVIED_DIALOG))) {
            const self = this;
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


