import { Component, Inject, Input, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Constants } from "../../../Constants/Constants";
import { DialogData } from "../../../Interfaces/DialogData";
import { AssociatesModel } from "../../../models/associates-model";
import { ObjectiveModel } from "../../../models/objective-model";
import { SentimentModel } from "../../../models/sentiment-model";
import { DataServiceService } from "../../../services/data-service.service";
import { MyLocalStorageService } from "../../../services/my-local-storage.service";
import { ApiHandlerService } from "../../../utils/api-handler.service";
import { CommonFunctionsService } from "../../../utils/common-functions.service";

@Component({
  selector: "app-objective-sentiment",
  templateUrl: "./objective-sentiment.component.html",
  styleUrls: ["./objective-sentiment.component.css"],
})
export class ObjectiveSentimentComponent implements OnInit {
  objectiveModel: ObjectiveModel;
  sentimentModel: SentimentModel;
  agentState: string;
  agentId: any;
  agentInfo: any;
  personList: AssociatesModel[] = new Array;
  selectedPerson: string;
  type: any;
  note: string = "";
  changeColor: boolean
  constructor(
    public dialogRef: MatDialogRef<ObjectiveSentimentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public apiHandler: ApiHandlerService,
    private myLocalStorage: MyLocalStorageService,
    private constants: Constants, private commonFunctions : CommonFunctionsService,public dataService : DataServiceService
  ) {}

  ngOnInit() {
    this.objectiveModel = JSON.parse(this.data.message);
    this.sentimentModel = JSON.parse(this.data.sentiment);

    if(this.sentimentModel.sentimentID)
    {
    this.note = this.sentimentModel.notes;
    if(this.sentimentModel.type === "1")
    document.getElementById("terrible").click()
    else if(this.sentimentModel.type === "2")
    document.getElementById("poor").click()
    else if(this.sentimentModel.type === "3")
    document.getElementById("alright").click()
    else if(this.sentimentModel.type === "4")
    document.getElementById("good").click()
    else if(this.sentimentModel.type === "5")
    document.getElementById("great").click()
    }

    else{
      this.sentimentModel = new SentimentModel();
    }

    console.log(this.note)
    let agentInfo = JSON.parse(
      sessionStorage.getItem(this.constants.ENTITY_INFO)
    );
    this.agentState = agentInfo.state;
    this.agentId = agentInfo.entityId;
    console.log(this.agentState, this.agentId);
    this.getPersonDetails();
  }
  onCancelClick() {
    this.dialogRef.close(false);
  }

  saveSentiment() {
    let self = this
    if (this.sentimentModel.sentimentID)
      this.apiHandler.modifySentiment(createSentimentRequestJson(this),
      {
        onSuccess(response: any) {
          
          self.commonFunctions.showSnackbar(response)
          self.dataService.shareSentimentData({data:'reload'})
          self.dialogRef.close(true);
          
        },
        onError(errorCode: number, errorMsg: string) {
          self.commonFunctions.showErrorSnackbar(errorMsg)

          self.dialogRef.close(false);

        }
      }
      )
    else
    {
      this.apiHandler.createSentiment(createSentimentRequestJson(this) ,
      {
        onSuccess(response: any) {
          
          self.commonFunctions.showSnackbar(response)
          self.dataService.shareSentimentData({data:'reload'})
          self.dialogRef.close(true);
          
        },
        onError(errorCode: number, errorMsg: string) {
          self.commonFunctions.showErrorSnackbar(errorMsg)

          self.dialogRef.close(false);

        }
      }
      )
    }
  }
  selectedSentiments(type) {
    this.type = type;
    this.sentimentModel.type = type;
  }
  getPersonDetails() {
    //this.apiHandler.getPersonList(this.agentState,this.agentId);
    this.apiHandler.getAssociates(this.agentId, "A", 1, this);
  }

  onSuccess(response: any) {
    let data: AssociatesModel[] = response.affiliation;
        data.forEach((element) => {
          if (element.personID) {
             this.personList.push(element);
          }
        });
    console.log(this.personList);

    if(this.sentimentModel)
    this.selectedPerson = this.sentimentModel.personID;
    // add a snackbaar
  }
  onError(errorCode: number, errorMsg: string) {
    this.dialogRef.close(false);
  }
}

function createSentimentRequestJson(context: ObjectiveSentimentComponent) {
  if(context.sentimentModel.sentimentID == null)
  {
  context.sentimentModel = new SentimentModel();

  context.sentimentModel.notes = context.note
  context.sentimentModel.type = context.type;
  context.sentimentModel.objectiveID = context.objectiveModel.objectiveID;
  context.sentimentModel.sentimentID = "0";
  context.sentimentModel.createDate = new Date().toString()
  context.sentimentModel.uid = context.objectiveModel.UID;
  context.sentimentModel.personID = context.selectedPerson;
  context.sentimentModel.personName = context.personList.find(e => e.personID == context.selectedPerson).dispname;
  }
  else{
    context.sentimentModel.notes = context.note;
    context.sentimentModel.type = context.type;
    context.sentimentModel.personID = context.selectedPerson;
    context.sentimentModel.personName = context.personList.find(e => e.personID == context.selectedPerson).dispname;

  }
  let finalJson = {
    sentiment: "",
    attr: context.sentimentModel,
  };
  return finalJson;
}
