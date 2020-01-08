import { Injectable, Injector } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ApiResponseCallback } from '../Interfaces/ApiResponseCallback';
import { API } from '../Constants/API';
import { DataServiceService } from '../services/data-service.service';
import { Constants } from '../Constants/Constants';
declare var require: any;
var json2xml = require('json2xml');

@Injectable({
  providedIn: 'root'
})
export class ApiHandlerService implements ApiResponseCallback {

  private APP_MODE: Array<string> = ["dev", "beta", "prod"];
  private ENABLE_APP_MODE = 0;
  private apiResponseCallback: ApiResponseCallback = null;
  constructor(private apiService: ApiService, public dataService: DataServiceService, private constants: Constants,
    private api: API) {

  }

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

  public getTopAgents(page_no: number, apiResponseCallback: ApiResponseCallback) {
    this.dataService.onHideShowLoader(true);
    this.apiResponseCallback = apiResponseCallback;
    this.apiService.hitGetApi(this.api.getTopAgentsUrl(page_no, this.APP_MODE[this.ENABLE_APP_MODE]), this);
  }

  /**
   * GetSearchedData
   */
  public GetSearchedData(type: string, stateId: string, searchString: string, pageNum: number, apiResponseCallback: ApiResponseCallback) {
    this.apiResponseCallback = apiResponseCallback;
    let url = this.api.getSearchedProfileUrl(this.APP_MODE[this.ENABLE_APP_MODE], stateId, type, pageNum, searchString);
    this.apiService.hitGetApi(url, this);
  }

  /**
   * getNews
   */
  public getNews(apiResponseCallback: ApiResponseCallback) {
    let url = this.api.getGoogleTopTenNewsUrl();
    this.apiService.hitGetApi(url, apiResponseCallback);
  }


  /**
   * getAgentDetailMenus
   */
  public getAgentDetailMenus(apiResponseCallback: ApiResponseCallback) {
    let url = this.api.AGENT_DETAIL_MENU;
    this.apiService.hitGetApi(url, apiResponseCallback);
  }


  /**
   * getPersonDetailMenus
   */
  public getPersonDetailMenus(apiResponseCallback: ApiResponseCallback) {
    let url = this.api.PERSON_DETAIL_MENU;
    this.apiService.hitGetApi(url, apiResponseCallback);
  }

  /**
   * getUserProfile
   */
  public getUserProfile(apiResponseCallback: ApiResponseCallback) {
    this.dataService.onHideShowLoader(true);
    this.apiResponseCallback = apiResponseCallback;
    let url = this.api.getUserProfileUrl(this.APP_MODE[this.ENABLE_APP_MODE]);
    this.apiService.hitGetApi(url, this);
  }

  /**
   * getUserPicture
   */
  public getUserPicture(apiResponseCallback: ApiResponseCallback) {
    this.dataService.onHideShowLoader(true);
    this.apiResponseCallback = apiResponseCallback;
    let url = this.api.getUserPictureUrl(this.APP_MODE[this.ENABLE_APP_MODE]);
    this.apiService.hitGetApi(url, this);
  }

  /**
   * ChangeShareableStatus
   */
  public ChangeShareableStatus(status: string, apiResponseCallback: ApiResponseCallback) {
    this.dataService.onHideShowLoader(true);
    //this.apiResponseCallback = apiResponseCallback;
    let url = this.api.getChangeShareableStatusUrl(this.APP_MODE[this.ENABLE_APP_MODE], status);
    this.apiService.hitGetApi(url, handleAddAndUpdateApiResponse(this, apiResponseCallback));
  }

  /**
   * shareVCard
   */
  public shareVCard(to: string, entityType: string, entityId: string, apiResponseCallback: ApiResponseCallback) {
    this.dataService.onHideShowLoader(true);
    let url = this.api.getShareVCardUrl(this.getAppMode(), to, entityType, entityId);
    this.apiService.hitGetApi(url, handleAddAndUpdateApiResponse(this, apiResponseCallback));
  }

  /**
   * getUserFavorites
   */
  public getUserFavorites(apiResponseCallback: ApiResponseCallback, pageNum: any) {
    this.apiResponseCallback = apiResponseCallback;
    this.dataService.onHideShowLoader(true);
    let url = this.api.getFavoritesUrl(this.getAppMode(), pageNum);
    this.apiService.hitGetApi(url, this);
  }

  /**
   * createNote
   */
  public createNote(requestJson: any, apiResponseCallback: ApiResponseCallback) {
    this.dataService.onHideShowLoader(true);
    let url = this.api.getCreateNoteUrl(this.getAppMode());
    this.apiService.hitPostApi(url, this.getRequestXml(requestJson), handleAddAndUpdateApiResponse(this, apiResponseCallback));
  }

  /**
   * getNotes
   */
  public getNotes(uid, entityType, entityId, pageNum: any, apiResponseCallback: ApiResponseCallback) {
    this.apiResponseCallback = apiResponseCallback;
    this.dataService.onHideShowLoader(true);
    let url = this.api.getNotesUrl(this.getAppMode(), uid, entityType, entityId, pageNum);
    this.apiService.hitGetApi(url, this);
  }

  /**
   * deleteNote
   */
  public deleteNote(noteId: string, apiResponseCallback: ApiResponseCallback) {
    this.dataService.onHideShowLoader(true);
    let url = this.api.getDeleteNoteUrl(this.getAppMode(), noteId);
    this.apiService.hitGetApi(url, handleAddAndUpdateApiResponse(this, apiResponseCallback));
  }

  /**
   * updateUserInfo
   */
  public updateUserInfo(requestJson: any, apiResponseCallback: ApiResponseCallback) {
    this.dataService.onHideShowLoader(true);
    let url = this.api.getUpdateUserProfileUrl(this.getAppMode());
    this.apiService.hitPostApi(url, this.getRequestXml(requestJson), handleAddAndUpdateApiResponse(this, apiResponseCallback));
  }

  /**
   * updateFavoriteStatus
   */
  public setFavoriteStatus(entityType, entityId, apiResponseCallback: ApiResponseCallback) {
    this.apiResponseCallback = apiResponseCallback;
    this.dataService.onHideShowLoader(true);
    let url = this.api.getSetFavoriteStatus(this.getAppMode(), entityType, entityId);
    this.apiService.hitGetApi(url, this);
  }

  /**
   * removeFavorite
   */
  public removeFavorite(entity: string, entityId: string, apiResponseCallback: ApiResponseCallback) {
    this.apiResponseCallback = apiResponseCallback;
    this.dataService.onHideShowLoader(true);
    let url = this.api.getRemoveFavoriteUrl(this.getAppMode(), entity, entityId);
    this.apiService.hitGetApi(url, handleAddAndUpdateApiResponse(this, apiResponseCallback));
  }

  /**
   * updateUserProfilePic
   */
  public updateUserProfilePic(requestJson: any, apiResponseCallback: ApiResponseCallback) {
    this.dataService.onHideShowLoader(true);
    let url = this.api.getUpdateProfilePicture(this.getAppMode());
    this.apiService.hitPostApi(url, this.getRequestXml(requestJson), handleAddAndUpdateApiResponse(this, apiResponseCallback));
  }

  /**
   * getAssociates
   */
  public getAssociates(entityId: string, entitiyType: string, pageNum: number, apiResponseCallback: ApiResponseCallback) {
    this.dataService.onHideShowLoader(true);
    this.apiResponseCallback = apiResponseCallback;
    let url = this.api.getAssociatesUrl(this.getAppMode(), entitiyType, entityId, pageNum);
    this.apiService.hitGetApi(url, this);
  }

  /**
   * getPersonAffiliations
   */
  public getPersonAffiliations(entityId: string, pageNum: number, apiResponseCallback: ApiResponseCallback) {
    this.dataService.onHideShowLoader(true);
    this.apiResponseCallback = apiResponseCallback;
    let url = this.api.getPersonAffiliationsUrl(this.getAppMode(), entityId, pageNum);
    this.apiService.hitGetApi(url, this);
  }

  /**
   * getEntityContactDetail
   */
  public getEntityContactDetail(entityId: string, entitiyType: string, apiResponseCallback) {
    this.dataService.onHideShowLoader(true);
    this.apiResponseCallback = apiResponseCallback;
    let url = this.api.getEntityContactDetailUrl(this.getAppMode(), entitiyType, entityId);
    this.apiService.hitGetApi(url, this);
  }

  /**
   * getAgentPerformance
   */
  public getAgentPerformance(pageNum, apiResponseCallback) {
    this.dataService.onHideShowLoader(true);
    this.apiResponseCallback = apiResponseCallback;
    let url = this.api.getAgentPerformanceUrl(this.getAppMode(), pageNum);
    this.apiService.hitGetApi(url, this);
  }

  /**
   * updateEntityProfile
   */
  public updateEntityProfile(requestJson: any, apiResponseCallback: ApiResponseCallback) {
    this.dataService.onHideShowLoader(true);
    let url = this.api.getUpdateEntityProfileUrl(this.getAppMode());
    this.apiService.hitPostApi(url, this.getRequestXml(requestJson), handleAddAndUpdateApiResponse(this, apiResponseCallback));
  }

  /**
   * getThirteenMonthActivity
   */
  public getThirteenMonthActivity(entityId: string, apiResponseCallback: ApiResponseCallback) {
    this.dataService.onHideShowLoader(true);
    this.apiResponseCallback = apiResponseCallback;
    let url = this.api.getThirteenMonthActivityUrl(this.getAppMode(), entityId);
    this.apiService.hitGetApi(url, this);
  }

  /**
   * updateNote
   */
  public updateNote(requestJson: any, apiResponseCallback: ApiResponseCallback) {
    this.dataService.onHideShowLoader(true);
    let url = this.api.getUpdateNoteUrl(this.getAppMode());
    this.apiService.hitPostApi(url, this.getRequestXml(requestJson), handleAddAndUpdateApiResponse(this, apiResponseCallback));
  }

  /**
   * getAlerts
   */
  public getAlerts(agentID: string, pageNum: any, apiResponseCallback: ApiResponseCallback) {
    this.dataService.onHideShowLoader(true);
    this.apiResponseCallback = apiResponseCallback;
    let url = this.api.getOpenAlertsUrl(this.getAppMode(), agentID, pageNum);
    this.apiService.hitGetApi(url, this);
  }

  /**
   * getClaims
   */
  public getClaims(agentID: string, type: string, pageNum: any, apiResponseCallback: ApiResponseCallback) {
    this.dataService.onHideShowLoader(true);
    this.apiResponseCallback = apiResponseCallback;
    let url = this.api.getClaimsUrl(this.getAppMode(), agentID, type, pageNum);
    this.apiService.hitGetApi(url, this);
  }

  /**
   * downloadClaimPdf
   */
  public downloadClaimPdf(claimID: string, apiResponseCallback: ApiResponseCallback) {
    this.dataService.onHideShowLoader(true);
    this.apiResponseCallback = apiResponseCallback;
    let url = this.api.getClaimDownloadPdfUrl(this.getAppMode(), claimID);
    this.apiService.hitGetApi(url, this);
  }
  /**
   * MarkAsReviewedAlert
   */
  public MarkAsReviewedAlert(claimID: string, apiResponseCallback: ApiResponseCallback) {
    this.dataService.onHideShowLoader(true);
    this.apiResponseCallback = apiResponseCallback;
    let url = this.api.getMarkAsReviewedUrl(this.getAppMode(), claimID);
    this.apiService.hitGetApi(url, handleAddAndUpdateApiResponse(this, apiResponseCallback));
  }

  /**
   * getAgentAudits
   */
  public getAgentAudits(agentID: string, pageNum: any, apiResponseCallback: ApiResponseCallback) {
    this.dataService.onHideShowLoader(true);
    this.apiResponseCallback = apiResponseCallback;
    let url = this.api.getAgentAuditsUrl(this.getAppMode(), agentID, pageNum);
    this.apiService.hitGetApi(url, this);
  }

  /**
   * downloadAuditPdf
   */
  public downloadAuditPdf(auditId: string, apiResponseCallback: ApiResponseCallback) {
    this.dataService.onHideShowLoader(true);
    this.apiResponseCallback = apiResponseCallback;
    let url = this.api.getDownloadAuditPdfUrl(this.getAppMode(), auditId);
    this.apiService.hitGetApi(url, this);
  }

  /**
   * getAgentCompliance
   */
  public getAgentCompliance(agentID: string, apiResponseCallback: ApiResponseCallback) {
    this.dataService.onHideShowLoader(true);
    this.apiResponseCallback = apiResponseCallback;
    let url = this.api.getAgentComplianceUrl(this.getAppMode(), agentID);
    this.apiService.hitGetApi(url, this);
  }

  /**
   * getUserConfig
   */
  public getUserConfig(apiResponseCallback: ApiResponseCallback) {
    this.dataService.onHideShowLoader(true);
    this.apiResponseCallback = apiResponseCallback;
    let url = this.api.getUserConfigUrl(this.getAppMode());
    this.apiService.hitGetApi(url, this);
  }

  /**
   * updateUserConfig
   */
  public updateUserConfig(requestJson: any, apiResponseCallback: ApiResponseCallback) {
    this.dataService.onHideShowLoader(true);
    let url = this.api.getUpdateUserConfigUrl(this.getAppMode());
    this.apiService.hitPostApi(url, this.getRequestXml(requestJson), handleAddAndUpdateApiResponse(this, apiResponseCallback));
  }

  /**
   * getNotifications
   */
  public getNotifications(stat: string, pageNum: number, apiResponseCallback: ApiResponseCallback) {
    this.dataService.onHideShowLoader(true);
    this.apiResponseCallback = apiResponseCallback;
    let url = this.api.getNotificationsUrl(this.getAppMode(), stat, pageNum);
    this.apiService.hitGetApi(url, this);
  }

  /**
   * dismissNotification
   */
  public dismissNotification(notificationID: string, apiResponseCallback: ApiResponseCallback) {
    this.dataService.onHideShowLoader(true);
    this.apiResponseCallback = apiResponseCallback;
    let url = this.api.getNotificationDismissUrl(this.getAppMode(), notificationID);
    this.apiService.hitGetApi(url, handleAddAndUpdateApiResponse(this, apiResponseCallback));
  }

  /**
   * changePassword
   */
  public changePassword(newPassword: string, apiResponseCallback: ApiResponseCallback) {
    this.dataService.onHideShowLoader(true);
    this.apiResponseCallback = apiResponseCallback;
    let url = this.api.getChangePasswordUrl(this.getAppMode(), newPassword);
    this.apiService.hitGetApi(url, handleAddAndUpdateApiResponse(this, apiResponseCallback));
  }


  /**
 * GetTagSearchedData
 */
  public GetTagSearchedData(type: string, stateId: string, searchString: string, pageNum: number, apiResponseCallback: ApiResponseCallback) {
    this.apiResponseCallback = apiResponseCallback;
    let url = this.api.getTagSearchUrl(this.APP_MODE[this.ENABLE_APP_MODE], stateId, type, pageNum, searchString);
    this.apiService.hitGetApi(url, this);
  }


  /**
   * getTags
   */
  public getTags(entityType: string, entityId: any, apiResponseCallback: ApiResponseCallback) {
    this.dataService.onHideShowLoader(true);
    this.apiResponseCallback = apiResponseCallback;
    let url = this.api.getTagsUrl(this.APP_MODE[this.ENABLE_APP_MODE], entityType, entityId);
    this.apiService.hitGetApi(url, this);
  }


  /**
   * setTags
   */
  public createTags(requestJson: any, apiResponseCallback: ApiResponseCallback) {
    this.dataService.onHideShowLoader(true);
    let url = this.api.getCreateNewTagUrl(this.APP_MODE[this.ENABLE_APP_MODE]);
    this.apiService.hitPostApi(url, this.getRequestXml(requestJson), handleAddAndUpdateApiResponse(this, apiResponseCallback));
  }

  /**
   * getAssociatedAgentFromTag
   */
  public getAssociatedAgentFromTag(selectedTag: string, type: string, currEntity: string, currEntityId: any, pageNum: number, apiResponseCallback: ApiResponseCallback) {
    this.dataService.onHideShowLoader(true);
    this.apiResponseCallback = apiResponseCallback;
    let url = this.api.getAssociatedAgentsWithTagUrl(this.APP_MODE[this.ENABLE_APP_MODE], selectedTag, type, currEntity, currEntityId, pageNum);
    this.apiService.hitGetApi(url, this);
  }

  /**
   * getObjectives
   */
  public getObjectives(stat: string, entity: any, entityId: any, objectiveFor: string, pageNum: any, apiResponseCallback: ApiResponseCallback) {
    this.apiResponseCallback = apiResponseCallback;
    this.dataService.onHideShowLoader(true);
    let url = this.api.getObjectivesUrl(this.APP_MODE[this.ENABLE_APP_MODE], stat, entity, entityId, objectiveFor, pageNum);
    this.apiService.hitGetApi(url, this);
  }

  /**
   * getStates
   */
  public getStates(apiResponseCallback: ApiResponseCallback) {
    let url = this.api.getStates();
    this.apiService.hitGetApi(url, apiResponseCallback);
  }

  private getAppMode(): string {
    return this.APP_MODE[this.ENABLE_APP_MODE];
  }
  private getRequestXml(requestJson: any): any {
    return json2xml(requestJson, { attributes_key: 'attr' });
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
function handleAddAndUpdateApiResponse(context: ApiHandlerService, apiResponseCallback: ApiResponseCallback) {
  return {
    onSuccess(response: any) {
      context.dataService.onHideShowLoader(false);
      let responseBody = response.Envelope.Body;
      if (responseBody.hasOwnProperty('Fault')) {
        let errorCode = responseBody.Fault.code;
        let msg = responseBody.Fault.message;
        apiResponseCallback.onError(errorCode, msg);
      }
      else {
        let msg = responseBody.Success.message;
        apiResponseCallback.onSuccess(msg);

      }
    },
    onError(errorCode: number, errorMsg: string) {
      context.dataService.onHideShowLoader(false);
      apiResponseCallback.onError(errorCode, errorMsg);
    }
  }
}



