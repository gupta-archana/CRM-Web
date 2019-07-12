import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MyLocalStorageService } from '../../../services/my-local-storage.service';
import { Constants } from '../../../Constants/Constants';
import { DialogData } from '../../../Interfaces/DialogData';

@Component({
  selector: 'app-send-email-confirmation',
  templateUrl: './send-email-confirmation.component.html',
  styleUrls: ['./send-email-confirmation.component.css']
})
export class SendEmailConfirmationComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SendEmailConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private myLocalStorage: MyLocalStorageService, private constants: Constants) { }
  isDontShowChecked: boolean = false;
  ngOnInit() {
  }

  dontShowAgainChanged(event) {
    this.myLocalStorage.setValue(this.constants.DONT_SHOW_SEND_EMAIL_DIALOG, event.target.checked);
  }
  onEmailAuditorClick() {
    this.dialogRef.close(true);
  }
  onCancelClick() {
    this.dialogRef.close(false);
  }
}
