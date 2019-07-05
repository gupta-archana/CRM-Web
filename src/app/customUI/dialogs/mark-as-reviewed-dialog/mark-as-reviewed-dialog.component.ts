import { Component, OnInit, Injector } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { BaseClass } from '../../../global/base-class';
import { MyLocalStorageService } from '../../../services/my-local-storage.service';
import { Constants } from '../../../Constants/Constants';

@Component({
  selector: 'app-mark-as-reviewed-dialog',
  templateUrl: './mark-as-reviewed-dialog.component.html',
  styleUrls: ['./mark-as-reviewed-dialog.component.css']
})
export class MarkAsReviewedDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MarkAsReviewedDialogComponent>,
    private myLocalStorage: MyLocalStorageService, private constants: Constants) { }

  isDontShowChecked: boolean = false;
  ngOnInit() {
  }
  dontShowAgainChanged(event) {
    this.myLocalStorage.setValue(this.constants.DONT_SHOW_MARK_REVIED_DIALOG, event.target.checked);
  }
  onMarkAsReviewClick() {
    this.dialogRef.close(true);
  }

  onCancelClick() {
    this.dialogRef.close(false);
  }
}
