import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MyLocalStorageService } from '../../../services/my-local-storage.service';
import { Constants } from '../../../Constants/Constants';

@Component({
  selector: 'app-email-noc',
  templateUrl: './email-noc.component.html',
  styleUrls: ['./email-noc.component.css']
})
export class EmailNocComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EmailNocComponent>,
    private myLocalStorage: MyLocalStorageService, private constants: Constants) { }

  isDontShowChecked: boolean = false;
  ngOnInit() {
  }
  dontShowAgainChanged(event) {
    this.myLocalStorage.setValue(this.constants.DONT_SHOW_EMAIL_NOC_DIALOG, event.target.checked);
  }
  onYesClick() {
    this.dialogRef.close(true);
  }

  onNoClick() {
    this.dialogRef.close(false);
  }
}
