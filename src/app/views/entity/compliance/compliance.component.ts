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

  constructor(private injector: Injector) { super(injector) }
  entityModel: EntityModel;
  lastEntityID: any;
  complianceModels: Array<ComplianceModel> = new Array();

  ngOnInit() {
    this.entityModel = JSON.parse(sessionStorage.getItem(this.constants.ENTITY_INFO));
    getData(this);

  }


  onSuccess(response: any) {
    this.complianceModels = response[response.name];
    this.renderUI();
  }
  onError(errorCode: number, errorMsg: string) {
    this.renderUI();
    this.commonFunctions.showErrorSnackbar(errorMsg)
  }


  onComplianceClick(item: ComplianceModel) {

    sessionStorage.setItem(this.constants.SELECTED_COMPLIANCE, JSON.stringify(item));
    this.commonFunctions.navigateWithoutReplaceUrl(this.paths.PATH_COMPLIANCE_DETAIL);

  }


  getFormattedDate(date: string) {
    return date.substring(0, 10);
  }
  goBack() {
    this.commonFunctions.backPress();
  }

  public renderUI() {
    setData(this);
    this.cdr.markForCheck();
  }

}
function makeServerRequest(context: ComplianceComponent) {
  //context.entityModel.entityId = "017575";
  context.apiHandler.getAgentCompliance(context.entityModel.entityId, context);
}

function setData(context: ComplianceComponent) {
  sessionStorage.setItem(context.constants.AGENT_COMPLIANCE_ARRAY, JSON.stringify(context.complianceModels));
  sessionStorage.setItem(context.constants.AGENT_COMPLIANCE_CURRENT_ENTITY_ID, context.entityModel.entityId);
}

function getData(context: ComplianceComponent) {
  let dataArray = JSON.parse(sessionStorage.getItem(context.constants.AGENT_COMPLIANCE_ARRAY));
  context.lastEntityID = sessionStorage.getItem(context.constants.AGENT_COMPLIANCE_CURRENT_ENTITY_ID);
  if (dataArray && dataArray.length > 0 && context.lastEntityID === context.entityModel.entityId) {
    context.complianceModels = dataArray;
  }
  else {
    makeServerRequest(context);
  }

}

