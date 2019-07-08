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

  ngOnInit() {
  }
  onDownloadPdfClick() {
    this.dialogRef.close(true);
  }
  onCancelClick() {
    this.dialogRef.close(false);
  }
}
