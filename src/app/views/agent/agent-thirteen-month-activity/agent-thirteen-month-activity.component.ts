import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { EntityModel } from '../../../models/entity-model';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { ThirteenMonthModel } from '../../../models/thirteen-month-model';

@Component({
  selector: 'app-agent-thirteen-month-activity',
  templateUrl: './agent-thirteen-month-activity.component.html',
  styleUrls: ['./agent-thirteen-month-activity.component.css']
})
export class AgentThirteenMonthActivityComponent extends BaseClass implements OnInit, ApiResponseCallback {

  monthsName: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  entityModel: EntityModel;
  thirteenMonthsModels: ThirteenMonthModel[] = new Array<ThirteenMonthModel>();

  constructor(private injector: Injector) {
    super(injector);
  }

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false

  };
  public barChartLabels: Array<any> = [];
  public barChartType = 'bar';
  public barChartLegend = true;
  barData: Array<any> = [];
  public barChartData = [
    { data: this.barData, label: 'NPR Actual' }
  ];

  public chartColors: Array<any> = [
    {
      backgroundColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)'
      ],

      borderWidth: 2,
    }
  ];


  ngOnInit() {
    this.entityModel = JSON.parse(sessionStorage.getItem(this.constants.ENTITY_INFO));
    makeServerRequest(this);
  }
  goBack() {
    this.commonFunctions.backPress();
  }

  onRecentProfileClick() {
    this.dataService.onRecentProfileClick();
  }

  getMonth(item: ThirteenMonthModel) {
    return this.monthsName[Number(item.month) - 1];;
  }

  onSuccess(response: any) {
    this.thirteenMonthsModels = response.activitymonth.reverse();
    setValueToBar(this);
    this.cdr.markForCheck();
  }
  onError(errorCode: number, errorMsg: string) {
    this.commonFunctions.showErrorSnackbar(errorMsg);
  }
}

function makeServerRequest(context: AgentThirteenMonthActivityComponent) {
  context.apiHandler.getThirteenMonthActivity(context.entityModel.entityId, context);
}


function setValueToBar(context: AgentThirteenMonthActivityComponent) {
  let maximumValue: number = 0;
  context.thirteenMonthsModels.forEach(element => {
    context.barData.push(element.nprActual);
    context.barChartLabels.push(context.getMonth(element) + '-' + element.year.substr(2, element.year.length));
    if (maximumValue < Number(element.nprActual)) {
      maximumValue = Number(element.nprActual);
    }
  });

  let scales = {
    yAxes: [{
      ticks: {
        steps: 10,
        max: maximumValue,
        min: 0
      }
    }]
  }

  context.barChartOptions['scales'] = scales;
}
