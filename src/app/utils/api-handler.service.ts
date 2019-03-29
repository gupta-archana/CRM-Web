import { Injectable, Injector } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ApiResponseCallback } from '../Interfaces/ApiResponseCallback';
import { API } from '../Constants/API';
import { DataServiceService } from '../services/data-service.service';
import { zip, Observable, forkJoin } from 'rxjs';
import { Response } from '@angular/http';
import { BaseClass } from '../global/base-class';
import { Constants } from '../Constants/Constants';

@Injectable({
  providedIn: 'root'
})
export class ApiHandlerService implements ApiResponseCallback {

  private APP_MODE: Array<string> = ["dev", "beta", "prod"];
  private ENABLE_APP_MODE = 0;
  private apiResponseCallback: ApiResponseCallback = null;
  constructor(private apiService: ApiService, private dataService: DataServiceService, private constants: Constants,
    private api: API) { }

  public getSideNavJson(apiResponseCallback: ApiResponseCallback) {
    this.apiService.hitGetApi(this.api.SIDE_NAV_JSON, apiResponseCallback);
  }

  public performLogin(email: string, encryptedPassword: string, apiResponseCallback: ApiResponseCallback) {
    this.apiResponseCallback = apiResponseCallback;
    this.apiService.hitGetApi(this.api.getValidateCredentialUrl(email, encryptedPassword, this.APP_MODE[this.ENABLE_APP_MODE]), this);
  }

  public forgotPassword(email: string, apiResponseCallback: ApiResponseCallback) {
    this.apiResponseCallback = apiResponseCallback;
    this.apiService.hitGetApi(this.api.getForgotPasswordUrl(email, this.APP_MODE[this.ENABLE_APP_MODE]), this.apiResponseCallback);
  }

  public getTopAgents(email: string, encryptedPassword: string, page_no: number, apiResponseCallback: ApiResponseCallback) {
    this.dataService.onHideShowLoader(true);
    this.apiResponseCallback = apiResponseCallback;
    this.apiService.hitGetApi(this.api.getTopAgentsUrl(email, encryptedPassword, page_no, this.APP_MODE[this.ENABLE_APP_MODE]), this);
  }

  /**
   * GetSearchedData
   */
  public GetSearchedData(email: string, encryptedPassword: string, agentId: string, stateId: string, searchString: string, apiResponseCallback: ApiResponseCallback, typeArray: Array<number>) {
    this.apiResponseCallback = apiResponseCallback;
    let apiObservables: Array<Observable<Response>> = [];
    let url;

    typeArray.forEach(element => {
      switch (element) {
        case 1:
          url = this.api.getAgentSearchedUrl(email, encryptedPassword, this.APP_MODE[this.ENABLE_APP_MODE], stateId, searchString);
          apiObservables.push(this.apiService.getHttpRequestObservable(url));
          break;
        case 2:
          url = this.api.getPersonSearchedUrl(email, encryptedPassword, this.APP_MODE[this.ENABLE_APP_MODE], stateId, agentId, searchString);
          apiObservables.push(this.apiService.getHttpRequestObservable(url));
          break;
        case 3:
          url = this.api.getAttorneySearchedUrl(email, encryptedPassword, this.APP_MODE[this.ENABLE_APP_MODE], stateId, searchString);
          apiObservables.push(this.apiService.getHttpRequestObservable(url));
          break;

        default:
          break;
      }
    });
    let self = this;
    this.apiService.hitMultipleRequest(apiObservables, {
      onSuccess(responses: any) {
        var searchedDataArray = handleMultipleCall(responses);
        if (searchedDataArray && searchedDataArray.length > 0) {
          apiResponseCallback.onSuccess(searchedDataArray)
        }
        else {
          apiResponseCallback.onError(200, self.constants.ERROR_NO_DATA_FOUND_FOR_SEARCH_CRITERIA);
        }
      }, onError(errorCode, errorMsg) {
        apiResponseCallback.onError(errorCode, errorMsg);
      }
    });
  }



  onSuccess(response: any) {
    this.dataService.onHideShowLoader(false);
    let responseBody = response.Envelope.Body;
    if (responseBody.hasOwnProperty('Fault')) {
      let errorCode = responseBody.Fault.code;
      let msg = responseBody.Fault.message;
      this.apiResponseCallback.onError(errorCode, msg);
    }
    else {
      let data: Object[] = responseBody.dataset[0];
      this.apiResponseCallback.onSuccess(data);
    }
  }
  onError(errorCode: number, errorMsg: string) {
    this.dataService.onHideShowLoader(false);
    this.apiResponseCallback.onError(errorCode, errorMsg);
  }
}

function handleMultipleCall(responses): Array<any> {
  let dataArray: Array<any> = [];
  responses.forEach(element => {
    var response = element.json();
    let responseBody = response.Envelope.Body;
    if (!responseBody.hasOwnProperty('Fault')) {
      let dataset: any = responseBody.dataset[0];
      if (dataset) {
        dataArray = addUserTypeInSearchData(dataset, dataArray);
      }
    }
  });

  return dataArray;
}

function addUserTypeInSearchData(dataset, userArray) {

  let userType = dataset.name;
  let data = dataset[userType];
  data.forEach(element => {
    element['type'] = userType;
    userArray.push(element);
  });
  return userArray;
}