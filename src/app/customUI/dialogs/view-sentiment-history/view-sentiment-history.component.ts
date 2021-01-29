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
export class ViewSentimentHistoryComponent implements OnInit, ApiResponseCallback {

  
  constructor(
    public apiHandler: ApiHandlerService,
    public constants: Constants,
    public dataService: DataServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private commonFunctions : CommonFunctionsService
  ) {}

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
  dates:any
  finalDate: any;
  ngOnInit(): void { 
    this.myForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      message: new FormControl('')
    });
init(this)
this.datee= formatMaxMinDate(this.todayDate)

  }

  goBack() {
    this.commonFunctions.backPress();
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
}

function fillData(context:ViewSentimentHistoryComponent)
{
  let chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    theme: "light2",
    title:{
      text: "Sentiment History"
    },
    axisX:{
      
      interval: 1,
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
  context.agentActiveSentiment.forEach((element) => {
    if (element.objectiveID === context.sentimentModel.objectiveID)
    {
      if(context.myForm.value.email != "" && context.myForm.value.message != "" )
      {
        const d = new Date(element.createDate);
        if(d.getTime() <= new Date(context.myForm.value.message).getTime() && d.getTime() >= new Date(context.myForm.value.email).getTime())
        {
          var str = formatDate(element.createDate)
          var date = parseInt(str.substring(0,4))  + "," + parseInt(str.substring(8,10)) + "," + parseInt(str.substring(6,7));
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
