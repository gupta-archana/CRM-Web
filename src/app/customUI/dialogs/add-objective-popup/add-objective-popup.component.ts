import { Component, OnInit, Inject, Injector } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Constants } from "../../../Constants/Constants";
import { BaseClass } from "../../../global/base-class";
import { DialogData } from "../../../Interfaces/DialogData";
import { EntityModel } from "../../../models/entity-model";
import { ObjectiveModel } from "../../../models/objective-model";
import { MyLocalStorageService } from "../../../services/my-local-storage.service";
import { ApiHandlerService } from "../../../utils/api-handler.service";
import { CommonFunctionsService } from "../../../utils/common-functions.service";

@Component({
  selector: "app-add-objective-popup",
  templateUrl: "./add-objective-popup.component.html",
  styleUrls: ["./add-objective-popup.component.css"],
})
export class AddObjectivePopupComponent implements OnInit {
  objectiveModel: ObjectiveModel;
  description: string
  dueDate: any;
  entityModel: EntityModel;
  selectedTab: string
  minDate = new Date();
  constructor(
    public dialogRef: MatDialogRef<AddObjectivePopupComponent>,
    private injector: Injector, private myStorage: MyLocalStorageService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public apiHandler: ApiHandlerService, private commonFunctions: CommonFunctionsService,
    private constants: Constants
  ) { }

  ngOnInit() {
    this.objectiveModel = JSON.parse(this.data.message);
    this.entityModel = JSON.parse(sessionStorage.getItem("entityinfo"));
    this.selectedTab = sessionStorage.getItem("tabSelected")
  }

  onCancelClick() {
    this.dialogRef.close(false);
  }
  onSaveChangesClick() {
    this.apiHandler.createObjective(createRequestJson(this), this);
  }
  onSuccess(response: any) {
    this.commonFunctions.showSnackbar("Objective" + " " + this.constants.CREATE_SUCCESS)
    this.dialogRef.close(true);
    // add a snackbaar
  }
  onError(errorCode: number, errorMsg: string) {
    this.commonFunctions.showErrorSnackbar("Objective" + " " + this.constants.CREATE_FAIL)
    this.dialogRef.close(false);
  }

  keyDownHandler(event) {
    if ((this.description == '' || this.description == undefined) && event.which === 32)
      event.preventDefault();
  }
}

function createRequestJson(context: AddObjectivePopupComponent) {
  if (context.objectiveModel == null) {
    context.objectiveModel = new ObjectiveModel()
    context.objectiveModel.description = context.description
    context.objectiveModel.dueDate = context.dueDate
    context.objectiveModel.objectiveID = "0"
    context.objectiveModel.entity = "A"
    context.objectiveModel.entityID = context.entityModel.entityId
    context.objectiveModel.UID = context.entityModel.email

    if (context.selectedTab == "1")
      context.objectiveModel.type = 't'
    else if (context.selectedTab == "2")
      context.objectiveModel.type = 'o'

    context.objectiveModel.private = 'no'
    context.objectiveModel.Stat = "A"

  }
  let finalJson = {
    objective: "",
    attr: context.objectiveModel,
  };
  return finalJson;
}
