import { ChangeDetectorRef, Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { EntityModel } from '../models/entity-model';
import { ApiHandlerService } from './api-handler.service';
import { CommonFunctionsService } from './common-functions.service';
import { ApiResponseCallback } from '../Interfaces/ApiResponseCallback';
import { Constants } from '../Constants/Constants';
import { MyLocalStorageService } from '../services/my-local-storage.service';
import { ConfigBasicModel } from '../models/config-basic-model';
import { ConfigNotificationModel } from '../models/config-notification-model';
import { ConfigReorderModel } from '../models/config-reorder-model';

@Injectable({
  providedIn: 'root'
})
export class CommonApisService {

  onApiResoponseSubject = new Subject();
  configBasicModels: Array<ConfigBasicModel> = [];
  configNotificationModels: Array<ConfigNotificationModel> = [];
  configReorderModels: Array<ConfigReorderModel> = [];
  constructor(private commonFunctions: CommonFunctionsService,
    public apiHandler: ApiHandlerService, public constants: Constants, public myLocalStorage: MyLocalStorageService) { }

  /**
   * setFavorite
   */
  public setFavorite(item: EntityModel, apiHandler: ApiHandlerService, cdr: ChangeDetectorRef) {
    var self = this;
    if (!this.commonFunctions.checkFavorite(item.entityId)) {
      this.removeFavorite(apiHandler, item, self, cdr);
    }
    else {
      this.addFavorite(apiHandler, item, self, cdr);
    }
    return this.onApiResoponseSubject;
  }



  private addFavorite(apiHandler: ApiHandlerService, item: EntityModel, self: this, cdr: ChangeDetectorRef) {
    apiHandler.setFavoriteStatus(item.type, item.entityId, {
      onSuccess(response: any) {
        item.favorite = "yes";
        item.sysfavoriteID = response.parameter[0].sysfavoriteID;
        self.commonFunctions.setFavoriteToSessionArray(item.entityId);
        self.onApiResoponseSubject.next();
        cdr.markForCheck();
      }, onError(errorCode, errorMsg) {
        self.commonFunctions.showErrorSnackbar(errorMsg);
      }
    });
  }

  private removeFavorite(apiHandler: ApiHandlerService, item: EntityModel, self: this, cdr: ChangeDetectorRef) {
    apiHandler.removeFavorite(item.type, item.entityId, {
      onSuccess(response: any) {
        self.commonFunctions.setFavoriteToSessionArray(item.entityId);
        item.favorite = "no";
        item.sysfavoriteID = '0';
        self.onApiResoponseSubject.next();
        cdr.markForCheck();
      }, onError(errorCode, errorMsg) {
        self.commonFunctions.showErrorSnackbar(errorMsg);
      }
    });
  }

  public updateBasicConfig(configType: string, configuration: any, apiResponseCallback?: ApiResponseCallback) {
    let self = this;
    this.apiHandler.updateUserConfig(getRequest(configType, configuration), {
      onSuccess(response: any) {
        self.commonFunctions.showSnackbar(response);
        if (apiResponseCallback)
          apiResponseCallback.onSuccess(response);
      },
      onError(errorCode: number, errorMsg: string) {
        self.commonFunctions.showErrorSnackbar(errorMsg);
        if (apiResponseCallback)
          apiResponseCallback.onError(errorCode, errorMsg);
      }
    });
  }

  public getAppConfig(): BehaviorSubject<any> {
    let subject = new BehaviorSubject<any>('');
    let self = this;
    this.apiHandler.getUserConfig({
      onSuccess(response: any) {
        if (response.sysuserconfig) {

          let sysuserconfig: Array<any> = response.sysuserconfig;
          sysuserconfig.forEach(element => {
            self.parseResponse(element);
          });
          setBasicConfigToVariables(self);
          saveRearrangeItemsInLocalStorage(self);
          subject.next(1);
        }
      },
      onError(errorCode, errorMsg) {
        subject.next(errorCode);
      }
    });
    return subject;
  }

  parseResponse(element: any) {
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
}
function getRequest(configType: string, configuration: any) {
  let requestJson = {
    "configType": configType,
    "configuration": configuration
  }
  let finalJson = {
    "sysuserconfig": "",
    "attr": requestJson
  }
  return finalJson;
}

function setBasicConfigToVariables(context: CommonApisService) {
  context.configBasicModels.forEach(element => {
    switch (element.configType.toLowerCase()) {
      case context.constants.HOME_SCREEN:
        let selectedHomeScreenPath = context.constants.sideNavItemsWithPath[element.configuration]
        context.myLocalStorage.setValue(context.constants.SELECTED_HOME_SCREEN, selectedHomeScreenPath);
        break;
      case context.constants.SEARCH_FILTER:

        let selectedSearchInPresenter = context.constants.searchEntityArrayObjectUserConfig[element.configuration];
        context.myLocalStorage.setValue(context.constants.SELECTED_SEARCH_IN, selectedSearchInPresenter);
        break;
      case context.constants.BATCH_SIZE:
        context.myLocalStorage.setValue(context.constants.NUMBER_OF_ROWS, element.configuration);

        break;
      case context.constants.NEWS_FEED:
        context.myLocalStorage.setValue(context.constants.SELECTED_NEWS_FEED, element.configuration);

        break;
      default:
        break;
    }
  });
}

function saveRearrangeItemsInLocalStorage(context: CommonApisService) {
  context.myLocalStorage.setValue(context.constants.AGENT_DETAIL_ITEMS, JSON.stringify(getRearrangeItemArray(context, context.constants.AGENT_MODULE)));
  context.myLocalStorage.setValue(context.constants.SIDE_NAV_ITEMS, JSON.stringify(getRearrangeItemArray(context, context.constants.HOME_MODULE)));
  context.myLocalStorage.setValue(context.constants.PERSON_DETAIL_ITEMS, JSON.stringify(getRearrangeItemArray(context, context.constants.PERSON_MODULE)));
  context.myLocalStorage.setValue(context.constants.USER_NOTIFICATIONS_CONTROLS, JSON.stringify(context.configNotificationModels));
}

function getRearrangeItemArray(context: CommonApisService, itemsFor: string) {
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
