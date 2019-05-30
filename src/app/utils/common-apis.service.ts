import { Injectable, Injector, ChangeDetectorRef } from '@angular/core';
import { BaseClass } from '../global/base-class';
import { EntityModel } from '../models/entity-model';
import { ApiHandlerService } from './api-handler.service';

@Injectable({
  providedIn: 'root'
})
export class CommonApisService {

  constructor() { }

  /**
   * setFavorite
   */
  public setFavorite(item: EntityModel, apiHandler: ApiHandlerService, cdr: ChangeDetectorRef) {

    if (item.favorite == "no") {
      apiHandler.setFavoriteStatus(item.type, item.entityId, {
        onSuccess(response: any) {
          item.favorite = "yes";
          cdr.markForCheck();
        }, onError(errorCode, errorMsg) {

        }
      })
    }
    else {
      apiHandler.removeFavorite(item.sysfavoriteID, {
        onSuccess(response: any) {
          item.favorite = "no";
          cdr.markForCheck();
        }, onError(errorCode, errorMsg) {

        }
      })
    }
  }
}
