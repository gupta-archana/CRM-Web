import { ChangeDetectorRef, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { EntityModel } from '../models/entity-model';
import { ApiHandlerService } from './api-handler.service';
import { CommonFunctionsService } from './common-functions.service';
import { ApiResponseCallback } from '../Interfaces/ApiResponseCallback';

@Injectable({
  providedIn: 'root'
})
export class CommonApisService {

  onApiResoponseSubject = new Subject();
  constructor(private commonFunctions: CommonFunctionsService,
    public apiHandler: ApiHandlerService) { }

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
