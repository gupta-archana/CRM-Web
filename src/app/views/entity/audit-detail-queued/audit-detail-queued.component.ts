import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { AuditModels } from '../../../models/audit-models';
import { EntityModel } from '../../../models/entity-model';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { DownloadPdfModel } from '../../../models/download-pdf-model';

@Component({
  selector: 'app-audit-detail-queued',
  templateUrl: './audit-detail-queued.component.html',
  styleUrls: ['./audit-detail-queued.component.css']
})
export class AuditDetailQueuedComponent extends BaseClass implements OnInit, ApiResponseCallback {


  constructor(private injector: Injector) { super(injector) }
  auditModel: AuditModels;
  entityModel: EntityModel;
  ngOnInit() {
    this.commonFunctions.showLoadedItemTagOnHeader([], "", true);
    this.entityModel = JSON.parse(sessionStorage.getItem(this.constants.ENTITY_INFO));
    this.auditModel = JSON.parse(sessionStorage.getItem(this.constants.SELECTED_AUDIT));
  }
  onSendEmailConfirmationClick() {
    if (!this.myLocalStorage.getValue(this.constants.DONT_SHOW_SEND_EMAIL_DIALOG)) {
      this.openDialogService.showSendMailConfirmationDialog(this.auditModel.auditor).afterClosed().subscribe(sendMail => {
        if (sendMail) {
          this.commonFunctions.doEmail(this.auditModel.uid)

        }
      });
    } else {
      this.commonFunctions.doEmail(this.auditModel.uid)
    }
  }
  goBack() {
    this.commonFunctions.backPress();
  }
  onDownloadPdfClick() {
    if (this.auditModel.auditID) {
      if (!this.myLocalStorage.getValue(this.constants.DONT_SHOW_DOWNLOAD_AUDIT_PDF_DIALOG)) {
        this.openDialogService.showDownloadPdfDialog(this.constants.DONT_SHOW_DOWNLOAD_AUDIT_PDF_DIALOG).afterClosed().subscribe(downloadPdf => {
          if (downloadPdf) {
            this.downloadAuditPdfApiCall();
          }
        })
      } else {
        this.downloadAuditPdfApiCall();
      }
    }
    else {
      this.commonFunctions.showErrorSnackbar("There is no audit id associated with this");
    }
  }
  private downloadAuditPdfApiCall() {
    this.apiHandler.downloadAuditPdf(this.auditModel.auditID, this);
  }

  onSuccess(response: any) {
    let downloadPdfModel: DownloadPdfModel[] = response.pdf;
    let base64Pdf = "";
    let filename: string;

    downloadPdfModel.forEach(element => {
      base64Pdf = base64Pdf + element.Base64;
      if (!filename) {
        let splittedName = element.filename.split("\\");
        filename = splittedName[splittedName.length - 1];
      }
    });


    this.commonFunctions.downloadPdf(base64Pdf, filename);
  }
  onError(errorCode: number, errorMsg: string) {
    this.commonFunctions.showErrorSnackbar(errorMsg)
  }
}
