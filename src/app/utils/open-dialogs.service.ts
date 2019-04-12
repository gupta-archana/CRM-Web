import { Injectable, Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AlertDialogComponent } from '../customUI/dialogs/alert-dialog/alert-dialog.component';
import { Constants } from '../Constants/Constants';
import { ConfirmationDialogComponent } from '../customUI/dialogs/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class OpenDialogsService {

  constructor(private dialog: MatDialog) {
  }
  showAlertDialog(alertTitle, alertMsg) {
    return this.dialog.open(AlertDialogComponent, {
      data: {
        alertTitle: alertTitle, message: alertMsg
      }
    });
  }

  showConfirmationDialog(alertTitle, alertMsg, noText?, yesText?) {
    if (!noText)
      noText = "NO";

    if (!yesText)
      yesText = "YES";
    return this.dialog.open(ConfirmationDialogComponent, {
      data: {
        alertTitle: alertTitle, message: alertMsg, noText: noText, yesText: yesText
      }
    });
  }
}
