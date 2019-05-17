import { Injectable, Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AlertDialogComponent } from '../customUI/dialogs/alert-dialog/alert-dialog.component';
import { Constants } from '../Constants/Constants';
import { ConfirmationDialogComponent } from '../customUI/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ChangeProfileDialogComponent } from '../customUI/dialogs/change-profile-dialog/change-profile-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class OpenDialogsService {

  constructor(private dialog: MatDialog) {
  }
  showAlertDialog(alertTitle, alertMsg, okText?) {
    if (!okText)
      okText = "OK";
    return this.dialog.open(AlertDialogComponent, {
      data: {
        alertTitle: alertTitle, message: alertMsg, okText: okText
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

  showChangePicDialog() {
    return this.dialog.open(ChangeProfileDialogComponent, { disableClose: false });
  }
}
