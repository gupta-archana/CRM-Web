import { Injectable, Injector } from '@angular/core';
import { zip } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MyLocalStorageService } from '../services/my-local-storage.service';
import { Constants } from './Constants';
import { BaseClass } from '../global/base-class';
import { CommonFunctionsService } from '../utils/common-functions.service';
@Injectable({
  providedIn: 'root'
})
export class API {
  SIDE_NAV_JSON = "../assets/jsons/sideNav.json";
  AGENT_DETAIL_MENU = "../assets/jsons/agent_detail_menu.json";
  private API_BASE_URL = "https://compass.alliantnational.com:8118/do/action/WService=";
  private numberOfRows: number;
  email: string = "";
  encryptedPassword: string = "";

  constructor(private commonFunctions: CommonFunctionsService, private myLocalStorage: MyLocalStorageService, private constants: Constants) {

    this.getNumberOfRows();
    this.getCredentials();
  }

  private getCredentials() {
    let credentials = this.commonFunctions.getLoginCredentials();
    this.email = credentials.email;
    this.encryptedPassword = credentials.password;
  }

  private getNumberOfRows() {
    this.numberOfRows = Number(this.myLocalStorage.getValue(this.constants.NUMBER_OF_ROWS));
    if (!this.numberOfRows)
      this.numberOfRows = 5;
  }

  getValidateCredentialUrl(username: string, password: string, app_mode: string) {
    return this.getBaseUrl(app_mode) + "I1=" + username + "&I2=" + password + "&I3=systemIdentity";
  }

  getForgotPasswordUrl(email: string, app_mode: string) {
    return this.getBaseUrl(app_mode) + "I3=systemEmailPassword&User=" + email;
  }

  getTopAgentsUrl(page_no: number, app_mode: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=topagentsget&PageNum=" + page_no + "&NoOfRows=" + this.numberOfRows;
  }

  getSearchedProfileUrl(app_mode: string, stateId: string, type: string, pageNum: number, searchString: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=profilesSearch&stateId=" + stateId + "&Type=" + type + "&PageNum=" + pageNum + "&NoOfRows=" + this.numberOfRows + "&searchString=" + searchString;
  }
  getAgentSearchedUrl(app_mode: string, stateId: string, searchString: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=agentssearch&stateId=" + stateId + "&searchString=" + searchString;
  }
  getPersonSearchedUrl(app_mode: string, stateId: string, agentId: string, searchString: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=personsSearch&stateId=" + stateId + "&agentId=" + agentId + "&searchString=" + searchString + "&active=&inactive";
  }
  getAttorneySearchedUrl(app_mode: string, stateId: string, searchString: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=attorneysSearch&stateId=" + stateId + "&searchString=" + searchString;
  }

  getUserProfileUrl(app_mode: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=userProfileGet&UID=" + this.email;
  }

  getUserPictureUrl(app_mode: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=userPictureGet";
  }

  getShareVCardUrl(app_mode: string, to: string, entityType: string, entityId: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=vCardShare&to=" + to + "&entity=" + entityType + "&entityID=" + entityId;
  }

  getChangeShareableStatusUrl(app_mode, status: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=userShareableStatusSet&ShareableStatus=" + status;
  }

  getAddFavoriteUrl(app_mode: string, entityType: string, entityId: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=systemFavoriteAdd&entity=" + entityType + "&entityID=" + entityId;
  }

  getFavoritesUrl(app_mode: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=SYStemFavoritesGet";
  }

  getCreateNoteUrl(app_mode: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=systemNoteNew";
  }


  getUpdateUserProfileUrl(app_mode: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=userProfileModify&uid=" + this.email;
  }

  getSetFavoriteStatus(app_mode: string, entityType: string, entityId: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=systemFavoriteAdd&entity=" + entityType + "&entityID=" + entityId;

  }

  getUpdateProfilePicture(app_mode: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=userPictureSet";
  }

  getGoogleTopTenNewsUrl() {
    return "https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en";
  }



  private getBaseUrl(app_mode: string) {
    return this.API_BASE_URL + app_mode + "/get?I0=JSON&I4=CRM&";
  }
}
