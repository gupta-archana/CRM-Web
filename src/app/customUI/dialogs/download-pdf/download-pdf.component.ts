import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { SendEmailConfirmationComponent } from '../send-email-confirmation/send-email-confirmation.component';
import { MyLocalStorageService } from '../../../services/my-local-storage.service';
import { Constants } from '../../../Constants/Constants';

@Component({
  selector: 'app-download-pdf',
  templateUrl: './download-pdf.component.html',
  styleUrls: ['./download-pdf.component.css']
})
export class DownloadPdfComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SendEmailConfirmationComponent>,
    private myLocalStorage: MyLocalStorageService, private constants: Constants) { }
    isDontShowChecked: boolean = false;
  ngOnInit() {
  }
  onEmailAuditorClick() {

  }
  onDownloadPdfClick() {
    this.dialogRef.close(true);
  }
  onCancelClick() {
    this.dialogRef.close(false);
  }
  dontShowAgainChanged(event) {
    this.myLocalStorage.setValue(this.constants.DONT_SHOW_DOWNLOAD_PDF_DIALOG, event.target.checked);
  }
}
