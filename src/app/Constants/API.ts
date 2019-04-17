import { Injectable } from '@angular/core';
import { zip } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MyLocalStorageService } from '../services/my-local-storage.service';
import { Constants } from './Constants';
@Injectable({
  providedIn: 'root'
})
export class API {
  SIDE_NAV_JSON = "../assets/jsons/sideNav.json";
  private API_BASE_URL = "https://compass.alliantnational.com:8118/do/action/WService=";
  private numberOfRows: number;
  constructor(private myLocalStorage: MyLocalStorageService, private constants: Constants) {
    this.numberOfRows = Number(myLocalStorage.getValue(constants.NUMBER_OF_ROWS));
    if (!this.numberOfRows)
      this.numberOfRows = 5;
  }

  getValidateCredentialUrl(username: string, password: string, app_mode: string) {
    return this.getBaseUrl(app_mode) + "I1=" + username + "&I2=" + password + "&I3=systemIdentity";
  }

  getForgotPasswordUrl(email: string, app_mode: string) {
    return this.getBaseUrl(app_mode) + "I3=systemEmailPassword&User=" + email;
  }

  getTopAgentsUrl(email: string, encryptedPassword: string, page_no: number, app_mode: string) {
    return this.getBaseUrl(app_mode) + "I1=" + email + "&I2=" + encryptedPassword + "&I3=topagentsget&PageNum=" + page_no + "&NoOfRows=" + this.numberOfRows;
  }


  getSearchedProfileUrl(email: string, encryptedPassword: string, app_mode: string, stateId: string, type: string, pageNum: number, searchString: string) {
    return this.getBaseUrl(app_mode) + "I1=" + email + "&I2=" + encryptedPassword + "&I3=profilesSearch&stateId=" + stateId + "&Type=" + type + "&PageNum=" + pageNum + "&NoOfRows=" + this.numberOfRows + "&searchString=" + searchString;
  }
  getAgentSearchedUrl(email: string, encryptedPassword: string, app_mode: string, stateId: string, searchString: string) {
    return this.getBaseUrl(app_mode) + "I1=" + email + "&I2=" + encryptedPassword + "&I3=agentssearch&stateId=" + stateId + "&searchString=" + searchString;
  }

  getPersonSearchedUrl(email: string, encryptedPassword: string, app_mode: string, stateId: string, agentId: string, searchString: string) {
    return this.getBaseUrl(app_mode) + "I1=" + email + "&I2=" + encryptedPassword + "&I3=personsSearch&stateId=" + stateId + "&agentId=" + agentId + "&searchString=" + searchString + "&active=&inactive";
  }
  getAttorneySearchedUrl(email: string, encryptedPassword: string, app_mode: string, stateId: string, searchString: string) {
    return this.getBaseUrl(app_mode) + "I1=" + email + "&I2=" + encryptedPassword + "&I3=attorneysSearch&stateId=" + stateId + "&searchString=" + searchString;
  }

  getGoogleTopTenNewsUrl() {
    return "https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en";
  }


  private getBaseUrl(app_mode: string) {
    return this.API_BASE_URL + app_mode + "/get?I0=JSON&I4=CRM&";
  }
}
