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
  public GetSearchedData(email: string, encryptedPassword: string, type: string, stateId: string, searchString: string, pageNum: number, apiResponseCallback: ApiResponseCallback) {
    this.apiResponseCallback = apiResponseCallback;
    let url = this.api.getSearchedProfileUrl(email, encryptedPassword, this.APP_MODE[this.ENABLE_APP_MODE], stateId, type, pageNum, searchString);
    this.apiService.hitGetApi(url, this);
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
      let data: Object[] = responseBody.dataset;
      if (data && data.length > 0)
        this.apiResponseCallback.onSuccess(data[0]);
      else
        this.onError(200, this.constants.ERROR_NO_DATA_AVAILABLE);
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