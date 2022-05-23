import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MyLocalStorageService } from '../../../services/my-local-storage.service';
import { Constants } from '../../../Constants/Constants';
import { DialogData } from '../../../Interfaces/DialogData';

@Component({
  selector: 'app-assigned-to',
  templateUrl: './assigned-to.component.html',
  styleUrls: ['./assigned-to.component.css']
})
export class AssignedToComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AssignedToComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private myLocalStorage: MyLocalStorageService, private constants: Constants) { }

  isDontShowChecked: boolean = false;
  ngOnInit() {
  }
  dontShowAgainChanged(event) {
    this.myLocalStorage.setValue(this.constants.DONT_SHOW_ASSIGNED_TO_DIALOG, event.target.checked);
  }
  onEmailTheAssignedClick() {
    this.dialogRef.close(true);
  }

  onCancelClick() {
    this.dialogRef.close(false);
  }
}
