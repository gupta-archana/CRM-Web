import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseClass } from '../../../../global/base-class';
import { ApiResponseCallback } from '../../../../Interfaces/ApiResponseCallback';
import { ConfigBasicModel } from '../../../../models/config-basic-model';
import { ConfigReorderModel } from '../../../../models/config-reorder-model';
import { ConfigNotificationModel } from '../../../../models/config-notification-model';
import * as configs from '../../../../Constants/ConfigArrays';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';

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
  selectedHomeScreenPath: string = "";
  selectedBatchSize: string = "";
  selectedSearchIn: string = "";
  selectedSearchInPresenter: string = "";
  selectedNewsFeed: string = "";

  appSettingForm: FormGroup;
 
  constructor(private injector: Injector) { super(injector); }

  ngOnInit() {
    addValidation(this);
    TabChanged(this);
  }
  rearrangeHomeModules() {
    this.myLocalStorage.setValue(this.constants.SIDE_NAV_ITEMS, JSON.stringify(getRearrangeItemArray(this, this.constants.HOME_MODULE)));
    this.commonFunctions.navigateWithoutReplaceUrl(this.paths.PATH_REARRANGE_DRAWER_ITEM);
  }

  rearrangeAgentDetailModules() {
    this.myLocalStorage.setValue(this.constants.AGENT_DETAIL_ITEMS, JSON.stringify(getRearrangeItemArray(this, this.constants.AGENT_MODULE)));
    this.commonFunctions.navigateWithoutReplaceUrl(this.paths.PATH_REARRANGE_AGENT_DETAIL_ITEM);
  }
  rearrangePersonDetailModules() {
    this.myLocalStorage.setValue(this.constants.AGENT_DETAIL_ITEMS, JSON.stringify(getRearrangeItemArray(this, this.constants.PERSON_MODULE)));
    this.commonFunctions.navigateWithoutReplaceUrl(this.paths.PATH_REARRANGE_PERSON_DETAIL_ITEM);
  }

  notficationControlClick() {
    this.myLocalStorage.setValue(this.constants.USER_NOTIFICATIONS_CONTROLS, JSON.stringify(this.configNotificationModels));
    this.commonFunctions.navigateWithoutReplaceUrl(this.paths.PATH_NOTIFICATION_CONTROL);
  }

  onSuccess(response: any) {
    if (response.sysuserconfig) {
      let sysuserconfig: Array<any> = response.sysuserconfig;
      sysuserconfig.forEach(element => {
        this.parseResponse(element);
      });
      setBasicConfigToVariables(this);
    }
  }
  onError(errorCode: number, errorMsg: string) {

  }

  private parseResponse(element: any) {
    if (element.configCategory == "Reorder") {
      element.configuration = JSON.parse(element.configuration.replace(/'/g, '"'));
      this.configReorderModels.push(element);
    }
    else if (element.configCategory == "Notification") {
      this.configNotificationModels.push(element);
    }
    else if (element.configCategory == "Basic") {
      this.configBasicModels.push(element);
    }
  }

  onHomeScreenChanged(event) {
    this.selectedHomeScreen = this.homeScreenArray[event.target.selectedIndex].name;
    this.selectedHomeScreenPath = this.homeScreenArray[event.target.selectedIndex].path;
    setBasicConfigToLocalStorage(this);
    this.commonApis.updateBasicConfig(this.constants.HOME_SCREEN, this.selectedHomeScreen);
  }
  onBatchSizeChanged(event) {
    this.selectedBatchSize = event.target.value;
    setBasicConfigToLocalStorage(this);
    this.commonApis.updateBasicConfig(this.constants.BATCH_SIZE, this.selectedBatchSize);
  }
  onSearchInChanged(event) {
    this.selectedSearchIn = event.target.value;
    this.selectedSearchInPresenter = this.constants.searchEntityArrayObjectUserConfig[this.selectedSearchIn];
    setBasicConfigToLocalStorage(this);
    this.commonApis.updateBasicConfig(this.constants.SEARCH_FILTER, this.selectedSearchIn);
    clearSearch(this);
  }
  onNewsFeedChanged(event) {
    this.selectedNewsFeed = event.target.value;
    setBasicConfigToLocalStorage(this);
    this.commonApis.updateBasicConfig(this.constants.NEWS_FEED, this.selectedNewsFeed);
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
      case context.constants.HOME_SCREEN:
        context.selectedHomeScreen = element.configuration;
        context.selectedHomeScreenPath = context.constants.sideNavItemsWithPath[element.configuration]
        break;
      case context.constants.SEARCH_FILTER:
        context.selectedSearchIn = element.configuration;
        context.selectedSearchInPresenter = context.constants.searchEntityArrayObjectUserConfig[context.selectedSearchIn];
        break;
      case context.constants.BATCH_SIZE:
        context.selectedBatchSize = element.configuration;
        break;
      case context.constants.NEWS_FEED:
        context.selectedNewsFeed = element.configuration;
        break;
      default:
        break;
    }
  });
  setValueToDropdowns(context);
  setBasicConfigToLocalStorage(context);
  context.cdr.markForCheck();
}

function setBasicConfigToLocalStorage(context: AppSettingComponent) {
  context.myLocalStorage.setValue(context.constants.SELECTED_SEARCH_IN, context.selectedSearchInPresenter);
  context.myLocalStorage.setValue(context.constants.NUMBER_OF_ROWS, context.selectedBatchSize);
  context.myLocalStorage.setValue(context.constants.SELECTED_HOME_SCREEN, context.selectedHomeScreenPath);
  context.myLocalStorage.setValue(context.constants.SELECTED_NEWS_FEED, context.selectedNewsFeed);

}

function TabChanged(context: AppSettingComponent) {
  context.tabSelectedSubscription = context.dataService.tabSelectedObservable.subscribe(index => {
    if (index == 1 && context.configBasicModels.length<=0) {
      context.apiHandler.getUserConfig(context);
    }
  })
}
function addValidation(context: AppSettingComponent) {
  context.appSettingForm = new FormGroup({
    selectedHomeScreen: new FormControl(context.selectedHomeScreen),
    selectedBatchSize: new FormControl(context.selectedBatchSize),
    selectedNewsFeed: new FormControl(context.selectedNewsFeed),
    selectedSearchIn: new FormControl(context.selectedSearchIn)
  })
}
function setValueToDropdowns(context: AppSettingComponent) {
  context.appSettingForm.get("selectedHomeScreen").setValue(context.selectedHomeScreen);
  context.appSettingForm.get("selectedBatchSize").setValue(context.selectedBatchSize);
  context.appSettingForm.get("selectedNewsFeed").setValue(context.selectedNewsFeed);
  context.appSettingForm.get("selectedSearchIn").setValue(context.selectedSearchIn);
}
function getRearrangeItemArray(context: AppSettingComponent, itemsFor: string) {
  let itemsArray = [];
  context.configReorderModels.every(function(element, index) {
    if (element.configType == itemsFor) {
      itemsArray = element.configuration;
      return false;
    }
    else
      return true;
  });
  return itemsArray;
}

function clearSearch(context: AppSettingComponent) {
  sessionStorage.removeItem(context.constants.SEARCHED_ENTITY_ARRAY);
  sessionStorage.removeItem(context.constants.SEARCH_CURRENT_PAGE_NO);
  sessionStorage.removeItem(context.constants.SEARCHED_STRING);
  sessionStorage.removeItem(context.constants.SEARCH_MORE_DATA_AVAILABLE_FLAG);
  sessionStorage.removeItem(context.constants.SEARCH_TOTAL_ROWS);

}
