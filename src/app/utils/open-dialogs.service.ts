import { Injectable, Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AlertDialogComponent } from '../customUI/dialogs/alert-dialog/alert-dialog.component';
import { Constants } from '../Constants/Constants';
import { ConfirmationDialogComponent } from '../customUI/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ChangeProfileDialogComponent } from '../customUI/dialogs/change-profile-dialog/change-profile-dialog.component';
import { MarkAsReviewedDialogComponent } from '../customUI/dialogs/mark-as-reviewed-dialog/mark-as-reviewed-dialog.component';
import { SendEmailConfirmationComponent } from '../customUI/dialogs/send-email-confirmation/send-email-confirmation.component';
import { DownloadPdfComponent } from '../customUI/dialogs/download-pdf/download-pdf.component';
import { EmailNocComponent } from '../customUI/dialogs/email-noc/email-noc.component';
import { AssignedToComponent } from '../customUI/dialogs/assigned-to/assigned-to.component';

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

  showMarkAsReviewedDialog() {
    return this.dialog.open(MarkAsReviewedDialogComponent);
  }

  showDownloadPdfDialog(downloadPdfCheckFlag: string) {
    return this.dialog.open(DownloadPdfComponent, {
      data: {
        name: downloadPdfCheckFlag
      }
    });
  }

  showSendMailConfirmationDialog(username: string) {
    return this.dialog.open(SendEmailConfirmationComponent, {
      data: {
        name: username
      }
    });
  }
  showEmailNocDialog() {
    return this.dialog.open(EmailNocComponent);
  }

  showAssignedToDialog(username: string) {
    return this.dialog.open(AssignedToComponent, {
      data: {
        name: username
      }
    });
  }
}
