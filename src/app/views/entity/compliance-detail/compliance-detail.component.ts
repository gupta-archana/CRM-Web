import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { EntityModel } from '../../../models/entity-model';
import { ComplianceModel } from '../../../models/compliance-model';

@Component({
  selector: 'app-compliance-detail',
  templateUrl: './compliance-detail.component.html',
  styleUrls: ['./compliance-detail.component.css']
})
export class ComplianceDetailComponent extends BaseClass implements OnInit {

  constructor(private injector: Injector) { super(injector) }
  entityModel: EntityModel;
  complianceModel: ComplianceModel;
  ngOnInit() {
    this.commonFunctions.showLoadedItemTagOnHeader([], "", true);
    this.entityModel = JSON.parse(sessionStorage.getItem(this.constants.ENTITY_INFO));
    this.complianceModel = JSON.parse(sessionStorage.getItem(this.constants.SELECTED_COMPLIANCE));
  }
  goBack() {
    this.commonFunctions.backPress();
  }
  onNocEmailClick() {
    if (!this.myLocalStorage.getValue(this.constants.DONT_SHOW_EMAIL_NOC_DIALOG)) {
      this.openDialogService.showEmailNocDialog().afterClosed().subscribe(sendmail => {
        if (sendmail) {
          this.commonFunctions.doEmail("");
        }
      });
    }
  }
}
