import { Injectable, Injector, ChangeDetectorRef } from '@angular/core';
import { BaseClass } from '../global/base-class';
import { EntityModel } from '../models/entity-model';
import { ApiHandlerService } from './api-handler.service';
import { CommonFunctionsService } from './common-functions.service';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonApisService {

  onApiResoponseSubject = new Subject();
  constructor(private commonFunctions: CommonFunctionsService) { }

  /**
   * setFavorite
   */
  public setFavorite(item: EntityModel, apiHandler: ApiHandlerService, cdr: ChangeDetectorRef) {
    var self = this;
    if (item.favorite == "no") {
      apiHandler.setFavoriteStatus(item.type, item.entityId, {
        onSuccess(response: any) {
          item.favorite = "yes";
          item.sysfavoriteID = response.parameter[0].sysfavoriteID;
          self.onApiResoponseSubject.next();
          cdr.markForCheck();
        }, onError(errorCode, errorMsg) {
          self.commonFunctions.showErrorSnackbar(errorMsg);
        }
      })
    }
    else {
      apiHandler.removeFavorite(item.sysfavoriteID, {
        onSuccess(response: any) {
          item.favorite = "no";
          item.sysfavoriteID = '0';
          self.onApiResoponseSubject.next();
          cdr.markForCheck();
        }, onError(errorCode, errorMsg) {
          self.commonFunctions.showErrorSnackbar(errorMsg);
        }
      })
    }
    return this.onApiResoponseSubject;
  }


}
