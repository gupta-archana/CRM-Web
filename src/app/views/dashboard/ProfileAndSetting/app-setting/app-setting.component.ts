import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseClass } from '../../../../global/base-class';
import { ApiResponseCallback } from '../../../../Interfaces/ApiResponseCallback';
import { ConfigBasicModel } from '../../../../models/config-basic-model';
import { ConfigReorderModel } from '../../../../models/config-reorder-model';
import { ConfigNotificationModel } from '../../../../models/config-notification-model';
import * as configs from '../../../../Constants/ConfigArrays';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-app-setting',
  templateUrl: './app-setting.component.html',
  styleUrls: ['./app-setting.component.css']
})
export class AppSettingComponent extends BaseClass implements OnInit, ApiResponseCallback, OnDestroy {



  tabSelectedSubscription: Subscription;

  configBasicModels: Array<ConfigBasicModel> = [];
  configNotificationModels: Array<ConfigNotificationModel> = [];
  configReorderModels: Array<ConfigReorderModel> = [];

  homeScreenArray: Array<any> = configs.HOME_SCREEN_ARRAY;
  searchInArray: Array<string> = configs.SEARCH_IN_ARRAY;
  batchSizeArray: Array<any> = configs.NUMBER_OF_ITEMS_LOAD_ARRAY;
  newsArray: Array<string> = configs.NEWS_CHANNEL_ARRAY;

  selectedHomeScreen: string = "";
  selectedBatchSize: string = "";
  selectedSearchIn: string = "";
  selectedNewsFeed: string = "";

  constructor(private injector: Injector) { super(injector); }

  ngOnInit() {
    TabChanged(this);
  }
  rearrangeHomeModules() {
    this.commonFunctions.navigateWithoutReplaceUrl(this.paths.PATH_REARRANGE_DRAWER_ITEM);
  }

  rearrangeAgentDetailModules() {
    this.commonFunctions.navigateWithoutReplaceUrl(this.paths.PATH_REARRANGE_AGENT_DETAIL_ITEM);
  }

  notficationControlClick() {
    this.commonFunctions.navigateWithoutReplaceUrl(this.paths.PATH_NOTIFICATION_CONTROL);
  }

  onSuccess(response: any) {
    if (response.sysuserconfig) {
      let sysuserconfig: Array<any> = response.sysuserconfig;
      sysuserconfig.forEach(element => {
        if (element.configCategory == "Reorder") {
          this.configReorderModels.push(element);
        }
        else if (element.configCategory == "Notification") {
          this.configNotificationModels.push(element);
        }

        else if (element.configCategory == "Basic") {
          this.configBasicModels.push(element);
        }
      });
      setBasicConfigToVariables(this);
    }
  }
  onError(errorCode: number, errorMsg: string) {

  }

  onHomeScreenChanged(event) {
    this.selectedHomeScreen = event.target.value;
  }
  onBatchSizeChanged(event) {
    this.selectedBatchSize = event.target.value;
  }
  onSearchInChanged(event) {
    this.selectedSearchIn = event.target.value;
  }
  onNewsFeedChanged(event) {
    this.selectedNewsFeed = event.target.value;
  }
  ngOnDestroy(): void {
    if (this.tabSelectedSubscription && !this.tabSelectedSubscription.closed) {
      this.tabSelectedSubscription.unsubscribe();
    }
  }
}

function setBasicConfigToVariables(context: AppSettingComponent) {
  context.configBasicModels.forEach(element => {
    switch (element.configType) {
      case "HomeScreen":
        context.selectedHomeScreen = element.configuration;
        break;
      case "SearchFilter":
        context.selectedSearchIn = element.configuration;
        break;
      case "BatchSize":
        context.selectedBatchSize = element.configuration;
        break;
      case "NewsFeed":
        context.selectedNewsFeed = element.configuration;
        break;
      default:
        break;
    }
  });
  context.cdr.markForCheck();
}

function setBasicConfigToLocalStorage(context: AppSettingComponent) {
  context.myLocalStorage.setValue(context.constants.SELECTED_SEARCH_IN, context.selectedSearchIn);
  context.myLocalStorage.setValue(context.constants.NUMBER_OF_ROWS, context.selectedBatchSize);
  context.myLocalStorage.setValue(context.constants.SELECTED_HOME_SCREEN, context.selectedHomeScreen);
  context.myLocalStorage.setValue(context.constants.SELECTED_NEWS_FEED, context.selectedNewsFeed);

}

function TabChanged(context: AppSettingComponent) {
  context.tabSelectedSubscription = context.dataService.tabSelectedObservable.subscribe(index => {
    if (index == 1) {
      context.apiHandler.getUserConfig(context);
    }
  })
}


