import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SendEmailConfirmationComponent } from '../send-email-confirmation/send-email-confirmation.component';
import { MyLocalStorageService } from '../../../services/my-local-storage.service';
import { Constants } from '../../../Constants/Constants';
import { DialogData } from '../../../Interfaces/DialogData';

@Component({
  selector: 'app-download-pdf',
  templateUrl: './download-pdf.component.html',
  styleUrls: ['./download-pdf.component.css']
})
export class DownloadPdfComponent implements OnInit {
  title: string = "";
  constructor(public dialogRef: MatDialogRef<DownloadPdfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private myLocalStorage: MyLocalStorageService, private constants: Constants) { }
  isDontShowChecked: boolean = false;
  ngOnInit() {
    if (this.data.name == this.constants.DONT_SHOW_DOWNLOAD_AUDIT_PDF_DIALOG) {
      this.title = "Download the Audit Details PDF";
    } else {
      this.title = "Download the Claim Details PDF";
    }
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
    this.myLocalStorage.setValue(this.data.name, event.target.checked);
  }
}
