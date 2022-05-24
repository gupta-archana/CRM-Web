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
        const self = this;
        if (!this.commonFunctions.checkFavorite(item.entityId)) {
            this.removeFavorite(apiHandler, item, self, cdr);
        } else {
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
                self.commonFunctions.showSnackbar(self.constants.ADD_FAVORITE);
            }, onError(errorCode, errorMsg) {
                self.commonFunctions.showErrorSnackbar(self.constants.ACTION_FAILED);
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
                self.commonFunctions.showSnackbar(self.constants.REMOVE_FAVORITE);
            }, onError(errorCode, errorMsg) {
                self.commonFunctions.showErrorSnackbar(self.constants.ACTION_FAILED);
            }
        });
    }

    public updateBasicConfig(configType: string, configuration: any, apiResponseCallback?: ApiResponseCallback) {
        const self = this;
        this.apiHandler.updateUserConfig(getRequest(configType, configuration), {
            onSuccess(response: any) {
                self.commonFunctions.showSnackbar(configType + " " + self.constants.UPDATe_SUCCESS);
                if (apiResponseCallback) {
                    apiResponseCallback.onSuccess(response);
                }
            },
            onError(errorCode: number, errorMsg: string) {
                self.commonFunctions.showErrorSnackbar(configType + " " + self.constants.UPDATED_FAIL);
                if (apiResponseCallback) {
                    apiResponseCallback.onError(errorCode, errorMsg);
                }
            }
        });
    }

    public getAppConfig(): BehaviorSubject<any> {
        const subject = new BehaviorSubject<any>('');
        const self = this;
        this.apiHandler.getUserConfig({
            onSuccess(response: any) {
                if (response.sysuserconfig) {

                    const sysuserconfig: Array<any> = response.sysuserconfig;
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
        if (element.configCategory === "Reorder") {
            element.configuration = JSON.parse(element.configuration.replace(/'/g, '"'));
            this.configReorderModels.push(element);
            console.log(this.configReorderModels);
        } else if (element.configCategory === "Notification") {
            this.configNotificationModels.push(element);
        } else if (element.configCategory === "Basic") {
            this.configBasicModels.push(element);
        }
    }
}
function getRequest(configType: string, configuration: any) {
    const requestJson = {
        "configType": configType,
        "configuration": configuration
    };
    const finalJson = {
        "sysuserconfig": "",
        "attr": requestJson
    };
    return finalJson;
}

function setBasicConfigToVariables(context: CommonApisService) {
    context.configBasicModels.forEach(element => {
        switch (element.configType.toLowerCase()) {
            case context.constants.HOME_SCREEN:
                const selectedHomeScreenPath = context.constants.sideNavItemsWithPath[element.configuration];
                context.myLocalStorage.setValue(context.constants.SELECTED_HOME_SCREEN, selectedHomeScreenPath);
                break;
            case context.constants.SEARCH_FILTER:

                const selectedSearchInPresenter = context.constants.searchEntityArrayObjectUserConfig[element.configuration];
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
    console.log(context.configReorderModels);
    context.configReorderModels.forEach(function (element, index) {
        if (element.configType === itemsFor) {
            itemsArray = element.configuration;
            return false;
        } else {
            return true;
        }
    });
    return itemsArray;
}
