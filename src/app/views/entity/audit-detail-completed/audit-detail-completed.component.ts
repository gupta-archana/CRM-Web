import { Component, OnInit, Injector } from '@angular/core';
import { AuditModels } from '../../../models/audit-models';
import { EntityModel } from '../../../models/entity-model';
import { BaseClass } from '../../../global/base-class';
import { DownloadPdfModel } from '../../../models/download-pdf-model';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';

@Component({
  selector: 'app-audit-detail-completed',
  templateUrl: './audit-detail-completed.component.html',
  styleUrls: ['./audit-detail-completed.component.css']
})
export class AuditDetailCompletedComponent extends BaseClass implements OnInit, ApiResponseCallback {

  constructor(private injector: Injector) { super(injector) }
  auditModel: AuditModels;
  entityModel: EntityModel;
  sectionScoreArray: string[];
  ngOnInit() {
    this.commonFunctions.showLoadedItemTagOnHeader([], "", true);
    this.entityModel = JSON.parse(sessionStorage.getItem(this.constants.ENTITY_INFO));
    this.auditModel = JSON.parse(sessionStorage.getItem(this.constants.SELECTED_AUDIT));

    this.sectionScoreArray = this.auditModel.sectionscore.split(",");
  }
  showLessBtn(event) {
    var button = event.target || event.srcElement || event.currentTarget;
    if (button.value == "SHOW MORE") {
      button.value = "SHOW LESS";
    }
    else {
      button.value = "SHOW MORE";
    }
    this.commonFunctions.printLog(button);
  }

  showLessBtnOther(event) {
    var button = event.target || event.srcElement || event.currentTarget;
    if (button.value == "SHOW MORE") {
      button.value = "SHOW LESS";
      document.getElementById("tableFixedHeightId").style.height = "auto";
    }
    else {
      button.value = "SHOW MORE";
      document.getElementById("tableFixedHeightId").style.height = "60px";
    }
    this.commonFunctions.printLog(button);
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
  onGeneratePdfClick() {
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
    let downloadPdfModel: DownloadPdfModel[] = response.File;
    let base64Pdf = "";
    let filename: string;

    downloadPdfModel.forEach(element => {
      base64Pdf = base64Pdf + element.Base64;
    });
    if (!filename) {
      let splittedName = response.FileName.split("\\");
      filename = splittedName[splittedName.length - 1];
    }

    this.commonFunctions.downloadPdf(base64Pdf, filename);
  }
  onError(errorCode: number, errorMsg: string) {
    this.commonFunctions.showErrorSnackbar(errorMsg);
  }
  goBack() {
    this.commonFunctions.backPress();
  }
}

