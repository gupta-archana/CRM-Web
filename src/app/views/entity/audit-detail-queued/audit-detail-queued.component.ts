import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { AuditModels } from '../../../models/audit-models';
import { EntityModel } from '../../../models/entity-model';

@Component({
  selector: 'app-audit-detail-queued',
  templateUrl: './audit-detail-queued.component.html',
  styleUrls: ['./audit-detail-queued.component.css']
})
export class AuditDetailQueuedComponent extends BaseClass implements OnInit {

  constructor(private injector: Injector) { super(injector) }
  auditModel: AuditModels;
  entityModel: EntityModel;
  ngOnInit() {
    this.entityModel = JSON.parse(sessionStorage.getItem(this.constants.ENTITY_INFO));
    this.auditModel = JSON.parse(sessionStorage.getItem(this.constants.SELECTED_AUDIT));
  }
  onSendEmailConfirmationClick() {
    this.openDialogService.showSendMailConfirmationDialog(this.auditModel.auditor).afterClosed().subscribe(sendMail => {
      if (sendMail) {
        this.commonFunctions.showSnackbar("send mail please");
      }
    });
  }
  goBack() {
    this.commonFunctions.backPress();
  }
  onDownloadPdfClick() {
    if (!this.myLocalStorage.getValue(this.constants.DONT_SHOW_DOWNLOAD_PDF_DIALOG)) {
      this.openDialogService.showDownloadPdfDialog().afterClosed().subscribe(downloadPdf => {

      })
    } else {

    }
  }
}
