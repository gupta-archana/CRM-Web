import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { ChartDataSets, ChartOptions } from "chart.js";
import { Label, Color } from "ng2-charts";
import { Subscription } from "rxjs";
import { Constants } from "../../../Constants/Constants";
import { ApiResponseCallback } from "../../../Interfaces/ApiResponseCallback";
import { DialogData } from "../../../Interfaces/DialogData";
import { EntityModel } from "../../../models/entity-model";
import { ObjectiveModel } from "../../../models/objective-model";
import { SentimentModel } from "../../../models/sentiment-model";
import { ThirteenMonthModel } from "../../../models/thirteen-month-model";
import { DataServiceService } from "../../../services/data-service.service";
import { MyLocalStorageService } from "../../../services/my-local-storage.service";
import { ApiHandlerService } from "../../../utils/api-handler.service";
import { CommonFunctionsService } from "../../../utils/common-functions.service";
import { ObjectiveSentimentComponent } from "../objective-sentiment/objective-sentiment.component";
import * as CanvasJS from '../../../../js/canvasjs.min';
import { FormControl, FormGroup } from "@angular/forms";
//declare var CanvasJS: any;

@Component({
  selector: "app-view-sentiment-history",
  templateUrl: "./view-sentiment-history.component.html",
  styleUrls: ["./view-sentiment-history.component.css"],
})
export class ViewSentimentHistoryComponent implements OnInit,ApiResponseCallback {

  
  constructor(
    public dialogRef: MatDialogRef<ViewSentimentHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public apiHandler: ApiHandlerService,
    public constants: Constants,
    public dataService: DataServiceService,
    private commonFunctions : CommonFunctionsService
  ) {}
  lastDate:any = new Date();
  sentimentModel: SentimentModel;
  agentActiveSentiment: SentimentModel[] = new Array<SentimentModel>();
  dataUpdatedSubscription: Subscription;
  sub:Subscription
  objectiveID
  entityModel: EntityModel;
  STATUS_ACTIVE = "A";
  STATUS_ALL = "ALL";
  OBJECTIVE_FOR_OUR = "O";
  OBJECTIVE_FOR_AGENT = "T";
  All_OBJECTIVE = "All";
  agentPageNum = 1;
  ourPageNum = 1;
  agentActiveSentiments: SentimentModel[] = new Array<SentimentModel>();
  barNprActualData = [];
  username:string;
  abc1:any;
  abc2:any;
  abc3:any;
  myForm: FormGroup;
  startDate:any;
  endDate:any;
  todayDate = new Date();
  datee:any;
  yearBeforeDate;
  dates:any
  finalDate: any;
  objectiveModel: ObjectiveModel;


  ngOnInit() { 
    this.objectiveModel = JSON.parse(this.data.message);
    this.sentimentModel = JSON.parse(this.data.sentiment);
    init(this)
    this.datee= formatMaxMinDate(this.todayDate)
    this.yearBeforeDate = formatMaxMinDate(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
    console.log(this.yearBeforeDate);
    this.lastDate = this.datee;
    this.myForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      message: new FormControl('')
    });
    this.myForm.controls.email.setValue(this.yearBeforeDate);
    this.myForm.controls.message.setValue(this.lastDate);
    calculation(this.myForm.controls.email.value,this.myForm.controls.message.value)

  }

  goBack() {
    this.commonFunctions.backPress();
  }

  onCancelClick() {
    this.dialogRef.close(false);
  }

  onSubmit(form: FormGroup) {
    this.startDate = form.value.email
    this.endDate = form.value.message


    console.log(this.startDate,this.endDate)
  
    fillData(this)
  this.dataService.onHideShowLoader(false);


  }

  getSentimentHistory(sentimentModel) {
    this.objectiveID = sentimentModel.objectiveID;
    this.apiHandler.getViewSentimentHistory(this.STATUS_ALL,this.entityModel.type,
      this.entityModel.entityId,this.All_OBJECTIVE,this.agentPageNum,this);
  }

  onSuccess(response: any) {
    this.agentActiveSentiment = response[1].sentiment;
    fillData(this)
  }
  onError(errorCode: number, errorMsg: string) {
    throw new Error("Method not implemented.");
  }

  handler(e){
    formatSelectedDate(this,e.target.value);
  }

}

function calculation(startDate,endDate)
{
 var start = new Date(startDate);
 var end = new Date(endDate);

var dataPoints = [];
var f =0
while(start < end){
  var month = start.getMonth();

  if(f!=0)
  var mm1 = month + 1;
  else
  var mm1 = month 
  var yyyy = start.getFullYear();
  if(mm1 >= 12)
  {
  mm1 = 0;
  var yyyy = start.getFullYear() + 1;
  }
    var mm = ((mm1+1)>=10)?(mm1 +1 ):'0'+(mm1+1);
    var dd = ((start.getDate())>=10)? (start.getDate()) : '0' + (start.getDate());
    
    var date = yyyy + '-' + mm + '-' + dd; //yyyy-mm-dd

   console.log(date)

    start = new Date(date); //date increase by 1
    dataPoints.push({
      x: new Date(date)
    });
  f++;

}
console.log(dataPoints)
return dataPoints;
}
function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, day, month].join(',');
}

function formatMaxMinDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

function formatSelectedDate(context:ViewSentimentHistoryComponent,date)
{
    context.dates = date;
    var year = date.substring(0,4)
    var month = date.substring(5,7)
    var day = date.substring(8,10)

    year = parseInt(year) + 1;
    year = year.toString()
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    
    var finalDate = year + '-' + month + '-' + day;
    context.finalDate = finalDate;
    context.lastDate = context.finalDate
context.myForm.controls.message.setValue(context.lastDate);

console.log(context.myForm.controls.message.value)
console.log(context.myForm.controls.email.value)


}

function fillData(context:ViewSentimentHistoryComponent)
{
  let chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    theme: "light2",
    // title:{
    //   text: "Sentiment History"
    // },
    axisX:{
      
      interval: 3,
      intervalType: "month",
      valueFormatString: "MMM YY"
    },
    axisY: {
      title: "Sentiment Scale",
    },
    legend:{
      cursor:"pointer",
      verticalAlign: "bottom",
      horizontalAlign: "left",
      dockInsidePlotArea: true,
      },
      data: [{
      type: "line",
      markerType: "square",
      xValueFormatString: "DD MMM",
      color: "#F08080",
      dataPoints: type1DataPoints(context)
    }]
  });
  console.log(context.barNprActualData);
    
  chart.render();

}
function type1DataPoints(context:ViewSentimentHistoryComponent)
{
  var dataPoints = [];
  dataPoints = calculation(context.myForm.value.email,context.myForm.value.message)
  context.agentActiveSentiment.forEach((element) => {
    if (element.objectiveID === context.sentimentModel.objectiveID)
    {
      if(context.myForm.value.email != "" && context.myForm.value.message != "" )
      {
        
        const d = new Date(element.createDate);
        if(d.setHours(0,0,0,0) <= new Date(context.myForm.value.message).setHours(0,0,0,0) && d.getTime() >= new Date(context.myForm.value.email).getTime())
        {
          var str = formatDate(element.createDate)
          var date = parseInt(str.substring(0,4))  + "," + parseInt(str.substring(8,10)) + "," + parseInt(str.substring(5,7));
        var inte = parseInt((element.type).toString())
        dataPoints.push({
          x: new Date(date), y: inte
        });
        }
      }
      else
      {
      var str = formatDate(element.createDate)
      var date = parseInt(str.substring(0,4))  + "," + parseInt(str.substring(8,10)) + "," + parseInt(str.substring(6,7));
    var inte = parseInt((element.type).toString())
    dataPoints.push({
      x: new Date(date), y: inte
    });
    }
    }
    console.log(context.barNprActualData);
  });

  return dataPoints;
}
function init(context:ViewSentimentHistoryComponent)
{
  context.entityModel = JSON.parse(
    sessionStorage.getItem(context.constants.ENTITY_INFO))

  context.dataUpdatedSubscription = context.dataService.shareSentimentsDataObservable.subscribe(sentimentModel => {
    if (sentimentModel) {
      context.sentimentModel = sentimentModel;
      console.log(sentimentModel)
    }
  });
  
  context.getSentimentHistory(context.sentimentModel);
}
