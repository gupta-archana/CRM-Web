import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { DialogData } from '../../../Interfaces/DialogData';
@Component({
  selector: 'app-change-profile-dialog',
  templateUrl: './change-profile-dialog.component.html',
  styleUrls: ['./change-profile-dialog.component.css']
})
export class ChangeProfileDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ChangeProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
  }
  onChangeClick() {
    this.dialogRef.close();
  }
  onDeleteClick() {
    this.dialogRef.close();
  }
}
