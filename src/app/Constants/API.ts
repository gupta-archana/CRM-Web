import { Injectable } from '@angular/core';
import { MyLocalStorageService } from '../services/my-local-storage.service';
import { CommonFunctionsService } from '../utils/common-functions.service';
import { Constants } from './Constants';
@Injectable({
  providedIn: 'root'
})
export class API {
  SIDE_NAV_JSON = "../assets/jsons/sideNav.json";
  AGENT_DETAIL_MENU = "../assets/jsons/agent_detail_menu.json";
  PERSON_DETAIL_MENU = "../assets/jsons/person_detail_menu.json";
  STATES_JSON_URL = "../assets/jsons/state.json";
  private API_BASE_URL = "https://compass.alliantnational.com:8118/do/action/WService=";
  private numberOfRows: number;
  email: string = "";
  encryptedPassword: string = "";

  constructor(private commonFunctions: CommonFunctionsService, private myLocalStorage: MyLocalStorageService, private constants: Constants) {
    this.getNumberOfRows();
  }

  public checkAndGetCredentials() {
    if (this.myLocalStorage.getValue(this.constants.LOGGED_IN))
      this.getCredentials();
  }

  private getCredentials() {
    let credentials = this.commonFunctions.getLoginCredentials();
    this.email = credentials.email;
    this.encryptedPassword = credentials.password;
  }

  public getNumberOfRows() {
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

    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=agentsNprActualToPlanGet&PageNum=" + page_no + "&NoOfRows=" + this.numberOfRows + "&NprSortOrder=T";
  }

  getSearchedProfileUrl(app_mode: string, stateId: string, type: string, pageNum: number, searchString: string) {

    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=profileSearch&stateId=" + stateId + "&Type=" + type + "&PageNum=" + pageNum + "&NoOfRows=" + this.numberOfRows + "&searchString=" + searchString;
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

    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=userCardShare&to=" + to + "&entity=" + entityType + "&entityID=" + entityId;
  }

  getChangeShareableStatusUrl(app_mode, status: string) {

    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=userCardShareable&ShareableStatus=" + status;
  }

  getAddFavoriteUrl(app_mode: string, entityType: string, entityId: string) {

    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=userFavoriteAdd&entity=" + entityType + "&entityID=" + entityId;
  }

  getFavoritesUrl(app_mode: string, pageNum: any) {

    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=userFavoritesGet" + "&PageNum=" + pageNum + "&NoOfRows=" + this.numberOfRows;
  }


  getNotesUrl(app_mode: string, uid: string, entityType: string, entityId: string, pageNum: any) {

    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=systemNotesGet&UID=" + uid + "&entity=" + entityType + "&entityID=" + entityId + "&PageNum=" + pageNum + "&NoOfRows=" + this.numberOfRows;
  }

  getCreateNoteUrl(app_mode: string) {

    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=userNoteNew";
  }


  getUpdateUserProfileUrl(app_mode: string) {

    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=userProfileModify";
  }

  getSetFavoriteStatus(app_mode: string, entityType: string, entityId: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=systemFavoriteAdd&entity=" + entityType + "&entityID=" + entityId;
  }

  getRemoveFavoriteUrl(app_mode, entity: string, entityId: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=userFavoriteDelete&Entity=" + entity + "&EntityId=" + entityId;
  }

  getUpdateProfilePicture(app_mode: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=userPictureSet";
  }

  getAssociatesUrl(app_mode: string, entityType: string, entityId: string, pageNum: number) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=affiliatedassociatesGet&entity=" + entityType + "&entityID=" + entityId + "&PageNum=" + pageNum + "&NoOfRows=" + this.numberOfRows;
  }

  getPersonAffiliationsUrl(app_mode: string, entityId: string, pageNum: number) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=affiliatedpersonGet&PersonID=" + entityId + "&PageNum=" + pageNum + "&NoOfRows=" + this.numberOfRows;
  }

  getEntityContactDetailUrl(app_mode: string, entityType: string, entityId: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=ContactGet&entity=" + entityType + "&entityID=" + entityId;
  }

  getAgentPerformanceUrl(app_mode: string, pageNum: number) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=agentsPerformanceGet&PageNum=" + pageNum + "&NoOfRows=" + this.numberOfRows;
  }

  getUpdateEntityProfileUrl(app_mode: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=contactModify";
  }

  getThirteenMonthActivityUrl(app_mode: string, agentId: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=Activity13MonthsGet&agentId=" + agentId;
  }

  getDeleteNoteUrl(app_mode: string, noteId: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=userNoteDelete&sysNoteID=" + noteId;
  }


  getUpdateNoteUrl(app_mode: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=userNoteModify";
  }

  getOpenAlertsUrl(app_mode: string, agentID: string, pageNum: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=agentalertget&PageNum=" + pageNum + "&NoOfRows=" + this.numberOfRows + "&agentID=" + agentID;
  }

  getClaimsUrl(app_mode: string, agentID: string, type: string, pageNum: any) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=agentClaimsGet&PageNum=" + pageNum + "&NoOfRows=" + this.numberOfRows + "&agentID=" + agentID + "&status=" + type;
  }

  getClaimDownloadPdfUrl(app_mode: string, claimID: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=agentclaimPdfGet&ClaimID=" + claimID + "&OverView=yes&Coverage=yes&Property=yes&Contact=yes&Account=yes&Recovery=yes&Litigation=yes&LinkedClaims=yes&Activity=yes&Notes=yes";
  }

  getMarkAsReviewedUrl(app_mode: string, claimID: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=agentAlertClosedSet&alertID=" + claimID;
  }

  getAgentAuditsUrl(app_mode: string, agentID: string, pageNum: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=agentAuditsGet&PageNum=" + pageNum + "&NoOfRows=" + this.numberOfRows + "&agentID=" + agentID;
  }

  getDownloadAuditPdfUrl(app_mode: string, auditId: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=auditReportGet&auditID=" + auditId;
  }

  getAgentComplianceUrl(app_mode: string, agentID: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=agentComplianceGet&AgentID=" + agentID;
  }

  getUserConfigUrl(app_mode: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=userconfigget";
  }

  getUpdateUserConfigUrl(app_mode: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=userconfigset";
  }

  getNotificationsUrl(app_mode: string, stat: string, pageNum: any) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=notificationsGet&Stat=" + stat + "&Entity=A&PageNum=" + pageNum + "&NoOfRows=" + this.numberOfRows;
  }

  getNotificationDismissUrl(app_mode: string, notificationID: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=userNotificationDismiss&NotificationID=" + notificationID;
  }

  getChangePasswordUrl(app_mode: string, newPassword: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=systemUserPassword&userid=" + this.email + "&password=" + newPassword;
  }

  getTagSearchUrl(app_mode: string, stateId: string, type: string, pageNum: number, searchString: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=tagsSearch&searchString=%23" + searchString + "&entity=" + type + "&PageNum=" + pageNum + "&NoOfRows=" + this.numberOfRows;
  }

  getTagsUrl(app_mode: string, entityType: string, entityId: any) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=userTagsGet&entity=" + entityType + "&entityID=" + entityId + "&getAllTags=false";
  }

  getCreateNewTagUrl(app_mode: string) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=userTagNew";
  }

  getAssociatedAgentsWithTagUrl(app_mode: string, tag: string, type: string, currEntity: string, currEntityId: any, pageNum: number) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=matchedtagSearch&searchString=%23" + tag + "&entity=" + type + "&PageNum=" + pageNum + "&NoOfRows=" + this.numberOfRows + "&currEntity=" + currEntity + "&currEntityID=" + currEntityId;
  }

  getObjectivesUrl(app_mode: string, stat: string, entity: any, entityId: any, type: string, pageNum: any) {
    return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=userObjectivesGet&entity=" + entity + "&entityID=" + entityId + "&stat=" + stat + "&type" + type + "&PageNum=" + pageNum + "&NoOfRows=" + this.numberOfRows;
  }

  getStates() {
    return this.STATES_JSON_URL;
  }

  getGoogleTopTenNewsUrl() {
    return "https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en";
  }



  private getBaseUrl(app_mode: string) {
    this.checkAndGetCredentials();
    this.getNumberOfRows();
    return this.API_BASE_URL + app_mode + "/get?I0=JSON&I4=CRM&";
  }
}
