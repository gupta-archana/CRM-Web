import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '../../../Interfaces/DialogData';
import { MyLocalStorageService } from '../../../services/my-local-storage.service';
import { Constants } from '../../../Constants/Constants';
import { ObjectiveModel } from '../../../models/objective-model';
import { ApiHandlerService } from '../../../utils/api-handler.service';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';

@Component({
  selector: 'app-edit-objective',
  templateUrl: './edit-objective.component.html',
  styleUrls: ['./edit-objective.component.css']
})
export class EditObjectiveComponent implements OnInit, ApiResponseCallback {


  objectiveModel: ObjectiveModel;
  constructor(public dialogRef: MatDialogRef<EditObjectiveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private apiHandler: ApiHandlerService) { }

  ngOnInit() {
    this.objectiveModel = JSON.parse(this.data.message);
  }
  onSaveChangesClick() {
    this.apiHandler.updateObjective(createRequestJson(this), this);
  }
  onCancelClick() {
    this.dialogRef.close(false);
  }
  onSuccess(response: any) {
    this.dialogRef.close(true);
    // add a snackbaar

  }
  onError(errorCode: number, errorMsg: string) {
    this.dialogRef.close(false);
  }
}
function createRequestJson(context: EditObjectiveComponent) {
  let finalJson = {
    "objective": "",
    "attr": context.objectiveModel
  }
  return finalJson;
}
