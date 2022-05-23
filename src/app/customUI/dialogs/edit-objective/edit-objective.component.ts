import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../../Interfaces/DialogData';
import { MyLocalStorageService } from '../../../services/my-local-storage.service';
import { Constants } from '../../../Constants/Constants';
import { ObjectiveModel } from '../../../models/objective-model';
import { ApiHandlerService } from '../../../utils/api-handler.service';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import * as moment from 'moment';
import { CommonFunctionsService } from '../../../utils/common-functions.service';


@Component({
  selector: 'app-edit-objective',
  templateUrl: './edit-objective.component.html',
  styleUrls: ['./edit-objective.component.css']
})
export class EditObjectiveComponent implements OnInit, ApiResponseCallback {


  objectiveModel: ObjectiveModel;
  dueDate: any;
  minDate = new Date();
  constructor(public dialogRef: MatDialogRef<EditObjectiveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private apiHandler: ApiHandlerService, private commonFunctions: CommonFunctionsService, private constants: Constants) { }

  ngOnInit() {
    this.objectiveModel = JSON.parse(this.data.message);
    console.log(this.objectiveModel)
    this.dueDate = new Date(this.objectiveModel.dueDate).toISOString();
    console.log(this.dueDate)
  }
  onSaveChangesClick() {
    this.objectiveModel.dueDate = this.dueDate;
    this.apiHandler.updateObjective(createRequestJson(this), this);
  }
  onCancelClick() {
    this.dialogRef.close(false);
  }
  onSuccess(response: any) {
    let self = this
    self.commonFunctions.showSnackbar("Objectiive" + " " + self.constants.UPDATe_SUCCESS)
    this.dialogRef.close(true);
    // add a snackbaar

  }
  onError(errorCode: number, errorMsg: string) {
    this.commonFunctions.showErrorSnackbar("Objective" + " " + this.constants.UPDATED_FAIL)
    this.dialogRef.close(false);
  }
  keyDownHandler(event) {
    if ((this.objectiveModel.description == '' || this.objectiveModel.description == undefined) && event.which === 32)
      event.preventDefault();
  }
}
function createRequestJson(context: EditObjectiveComponent) {
  let finalJson = {
    "objective": "",
    "attr": context.objectiveModel
  }
  return finalJson;
}
