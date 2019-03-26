import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ApiResponseCallback } from '../Interfaces/ApiResponseCallback';
import { API } from '../Constants/API';

@Injectable({
  providedIn: 'root'
})
export class ApiHandlerService implements ApiResponseCallback {

  private APP_MODE: Array<string> = ["dev", "beta", "prod"];
  private ENABLE_APP_MODE = 0;
  private apiResponseCallback: ApiResponseCallback = null;
  constructor(private apiService: ApiService,
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
    this.apiResponseCallback = apiResponseCallback;
    this.apiService.hitGetApi(this.api.getTopAgentsUrl(email, encryptedPassword, page_no, this.APP_MODE[this.ENABLE_APP_MODE]), this);
  }



  onSuccess(response: any) {
    let responseBody = response.Envelope.Body;
    if (responseBody.hasOwnProperty('Fault')) {
      let errorCode = responseBody.Fault.code;
      let msg = responseBody.Fault.message;
      this.apiResponseCallback.onError(errorCode, msg);
    }
    else {
      let data: Object[] = responseBody.dataset[0].parameter;
      this.apiResponseCallback.onSuccess(data);
    }
  }
  onError(errorCode: number, errorMsg: string) {
    this.apiResponseCallback.onError(errorCode, errorMsg);
  }
}
