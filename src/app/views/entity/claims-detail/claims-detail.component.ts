import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { EntityModel } from '../../../models/entity-model';
import { ClaimsModel } from '../../../models/claims-model';
import { ApiResponseCallback } from 'src/app/Interfaces/ApiResponseCallback';
import { DownloadPdfModel } from 'src/app/models/download-pdf-model';

@Component({
  selector: 'app-claims-detail',
  templateUrl: './claims-detail.component.html',
  styleUrls: ['./claims-detail.component.css']
})
export class ClaimsDetailComponent extends BaseClass implements OnInit, ApiResponseCallback {


  entityModel: EntityModel;
  claimsModel: ClaimsModel;
  constructor(private injector: Injector) { super(injector) }

  ngOnInit() {
    this.entityModel = JSON.parse(sessionStorage.getItem(this.constants.ENTITY_INFO));
    this.claimsModel = JSON.parse(sessionStorage.getItem(this.constants.SELECTED_CLAIM));
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
  goBack() {
    this.commonFunctions.backPress();
  }
  getAddition() {
    let addValues = Number(this.claimsModel.LAEAmmount) + Number(this.claimsModel.LossAmmount);

    return addValues;
  }

  onDownloadPdfClick() {

    if (!this.myLocalStorage.getValue(this.constants.DONT_SHOW_DOWNLOAD_PDF_DIALOG)) {
      this.openDialogService.showDownloadPdfDialog(this.constants.DONT_SHOW_DOWNLOAD_PDF_DIALOG).afterClosed().subscribe(downloadPdf => {
        if (downloadPdf) {
          this.downloadPdf();
        }
      })
    } else {
      this.downloadPdf();
    }
  }

  downloadPdf() {
    this.apiHandler.downloadClaimPdf(this.claimsModel.claimID, this);
  }

  onAssignedToClick() {
    if (this.claimsModel.UID) {
      if (!this.myLocalStorage.getValue(this.constants.DONT_SHOW_ASSIGNED_TO_DIALOG)) {
        this.openDialogService.showAssignedToDialog(this.claimsModel.userName).afterClosed().subscribe(sendEmail => {
          if (sendEmail)
            this.sendMail();
        })
      }
      else {
        this.sendMail();
      }
    }
    else {
      this.commonFunctions.showErrorSnackbar("No email id provided in this claim");
    }
  }

  private sendMail() {
    this.commonFunctions.doEmail(this.claimsModel.UID);
  }

  onSuccess(response: any) {

    let downloadPdfModel: DownloadPdfModel[] = response.pdf;
    let base64Pdf = "";
    let filename: string;

    downloadPdfModel.forEach(element => {
      base64Pdf = base64Pdf + element.base64;
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

