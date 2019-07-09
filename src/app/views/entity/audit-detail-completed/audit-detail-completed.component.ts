import { Component, OnInit, Injector } from '@angular/core';
import { AuditModels } from '../../../models/audit-models';
import { EntityModel } from '../../../models/entity-model';
import { BaseClass } from '../../../global/base-class';

@Component({
  selector: 'app-audit-detail-completed',
  templateUrl: './audit-detail-completed.component.html',
  styleUrls: ['./audit-detail-completed.component.css']
})
export class AuditDetailCompletedComponent extends BaseClass implements OnInit {

  constructor(private injector: Injector) { super(injector) }
  auditModel: AuditModels;
  entityModel: EntityModel;
  sectionScoreArray: string[];
  ngOnInit() {
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
    this.openDialogService.showSendMailConfirmationDialog(this.auditModel.auditor).afterClosed().subscribe(sendMail => {
      if (sendMail) {
        //this.commonFunctions.doEmail(this.auditModel)

        this.commonFunctions.showSnackbar("send mail please");
      }
    });
  }
  onGeneratePdfClick() {
    this.openDialogService.showDownloadPdfDialog().afterClosed().subscribe(downloadPdf => {
      if (downloadPdf) {
        //this.apiHandler.downloadAuditPdf(this.auditModel.)
      }
    });
  }
  goBack() {
    this.commonFunctions.backPress();
  }
}
function downloadPdf(context: AuditDetailCompletedComponent, pdfInBase64: any, fileName: string) {
  const newBlob = new Blob([pdfInBase64], { type: 'application/pdf' });
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(newBlob); // For IE browser
  }
  const linkSource = 'data:application/pdf;base64,' + pdfInBase64;
  const downloadLink = document.createElement("a");
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
}
