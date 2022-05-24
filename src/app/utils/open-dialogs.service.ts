import { Injectable, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../customUI/dialogs/alert-dialog/alert-dialog.component';
import { Constants } from '../Constants/Constants';
import { ConfirmationDialogComponent } from '../customUI/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ChangeProfileDialogComponent } from '../customUI/dialogs/change-profile-dialog/change-profile-dialog.component';
import { MarkAsReviewedDialogComponent } from '../customUI/dialogs/mark-as-reviewed-dialog/mark-as-reviewed-dialog.component';
import { SendEmailConfirmationComponent } from '../customUI/dialogs/send-email-confirmation/send-email-confirmation.component';
import { DownloadPdfComponent } from '../customUI/dialogs/download-pdf/download-pdf.component';
import { EmailNocComponent } from '../customUI/dialogs/email-noc/email-noc.component';
import { AssignedToComponent } from '../customUI/dialogs/assigned-to/assigned-to.component';
import { EditObjectiveComponent } from '../customUI/dialogs/edit-objective/edit-objective.component';
import { AddNewEventComponent } from '../customUI/dialogs/add-new-event/add-new-event.component';
import { EditAndDeleteTagPopupComponent } from '../customUI/dialogs/edit-and-delete-tag-popup/edit-and-delete-tag-popup.component';
import { AddObjectivePopupComponent } from '../customUI/dialogs/add-objective-popup/add-objective-popup.component';
import { ObjectiveSentimentComponent } from '../customUI/dialogs/objective-sentiment/objective-sentiment.component';
import { ViewSentimentHistoryComponent } from '../customUI/dialogs/view-sentiment-history/view-sentiment-history.component';

@Injectable({
    providedIn: 'root'
})
export class OpenDialogsService {

    constructor(private dialog: MatDialog) {
    }
    showAlertDialog(alertTitle, alertMsg, okText?) {
        if (!okText) {
            okText = "OK";
        }
        return this.dialog.open(AlertDialogComponent, {
            data: {
                alertTitle: alertTitle, message: alertMsg, okText: okText
            }
        });
    }

    showConfirmationDialog(alertTitle, alertMsg, noText?, yesText?) {
        if (!noText) {
            noText = "NO";
        }

        if (!yesText) {
            yesText = "YES";
        }
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
    showEditObjectiveDialog(objective: string) {
        return this.dialog.open(EditObjectiveComponent,
            {
                data: {
                    message: objective
                }
            });
    }

    showAddObjectiveDialog(objective: string) {
        return this.dialog.open(AddObjectivePopupComponent,
            {
                data: {
                    message: objective
                }
            });
    }

    showRecordSentimentsDialog(objective: string, sentiment) {
        return this.dialog.open(ObjectiveSentimentComponent,
            {
                data: {
                    message: objective, sentiment
                }
            });
    }
    showViewSentimentHistoryDialog(objective: string, sentiment) {
        return this.dialog.open(ViewSentimentHistoryComponent,
            {
                data: {
                    message: objective, sentiment
                }
            });
    }


    showEditTagDialog(objective: string) {
        return this.dialog.open(EditAndDeleteTagPopupComponent,
            {
                data: {
                    message: objective
                }
            });
    }

    showAddNewEventDialog() {
        return this.dialog.open(AddNewEventComponent);
    }
    showSentimentHistoryDialog() {
        return this.dialog.open(ViewSentimentHistoryComponent);
    }
}
