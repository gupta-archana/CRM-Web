import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { ComplianceModel } from '../../../models/compliance-model';
import { EntityModel } from '../../../models/entity-model';

@Component({
    selector: 'app-compliance',
    templateUrl: './compliance.component.html',
    styleUrls: ['./compliance.component.css']
})
export class ComplianceComponent extends BaseClass implements OnInit {

    constructor(private injector: Injector) {
        super(injector);
    }
    entityModel: EntityModel;
    lastEntityID: any;
    complianceModels: Array<ComplianceModel> = new Array();
    hideNoDataDiv = false;
    errorMsg = "";
    ngOnInit() {
        this.commonFunctions.showLoadedItemTagOnHeader([], "", true);
        this.entityModel = JSON.parse(sessionStorage.getItem(this.constants.ENTITY_INFO));
        getData(this);

    }


    onSuccess(response: any) {
        this.complianceModels = response[response.name];
        this.renderUI();
    }
    onError(errorCode: number, errorMsg: string) {
        this.errorMsg = errorMsg;
        this.renderUI();
    // this.commonFunctions.showErrorSnackbar(errorMsg)
    }

    onComplianceClick(item: ComplianceModel) {

        sessionStorage.setItem(this.constants.SELECTED_COMPLIANCE, JSON.stringify(item));
        this.commonFunctions.navigateWithoutReplaceUrl(this.paths.PATH_COMPLIANCE_DETAIL);

    }
    getComplianceDate(item: ComplianceModel) {
        let date = "";
        if (item.expirationDate) {
            date = "Expiration Date: " + item.expirationDate;
        }

        return date;
    }

    getFormattedDate(date: string) {
        return date.substring(0, 10);
    }
    goBack() {
        this.commonFunctions.backPress();
    }

    public renderUI() {
        setData(this);
        checkAndSetUi(this);
        this.cdr.markForCheck();
    }

}
function makeServerRequest(context: ComplianceComponent) {
    // context.entityModel.entityId = "017575";
    context.apiHandler.getAgentCompliance(context.entityModel.entityId, context);
}

function setData(context: ComplianceComponent) {
    sessionStorage.setItem(context.constants.AGENT_COMPLIANCE_ARRAY, JSON.stringify(context.complianceModels));
    sessionStorage.setItem(context.constants.AGENT_COMPLIANCE_CURRENT_ENTITY_ID, context.entityModel.entityId);
}

function getData(context: ComplianceComponent) {
    const dataArray = JSON.parse(sessionStorage.getItem(context.constants.AGENT_COMPLIANCE_ARRAY));
    context.lastEntityID = sessionStorage.getItem(context.constants.AGENT_COMPLIANCE_CURRENT_ENTITY_ID);
    if (dataArray && dataArray.length > 0 && context.lastEntityID === context.entityModel.entityId) {
        context.complianceModels = dataArray;
        context.renderUI();
    } else {
        makeServerRequest(context);
    }

}

function checkAndSetUi(context: ComplianceComponent) {
    if (!context.complianceModels || context.complianceModels.length === 0) {
        resetData(context);
    } else {
        context.hideNoDataDiv = true;
    }
    context.cdr.markForCheck();
}

function resetData(context: ComplianceComponent) {

    context.complianceModels = [];

    context.hideNoDataDiv = false;
}
