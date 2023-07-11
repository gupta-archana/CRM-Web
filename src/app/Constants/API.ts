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
    private API_BASE_URL = "https://compassbeta.alliantnational.com:8118/do/action/WService=";
    //private API_BASE_URL = "";
    private numberOfRows: number;
    email = "";
    encryptedPassword = "";

    constructor(private commonFunctions: CommonFunctionsService, private myLocalStorage: MyLocalStorageService, private constants: Constants) {
        this.getNumberOfRows();
        //this.getServerURL();
    }

    private getServerURL(){
        this.API_BASE_URL = this.myLocalStorage.getValue(this.constants.SERVER_URL);
    }

    public checkAndGetCredentials() {
        if (this.myLocalStorage.getValue(this.constants.LOGGED_IN)) {
            this.getCredentials();
        }
    }

    private getCredentials() {
        const credentials = this.commonFunctions.getLoginCredentials();
        this.email = credentials.email;
        this.encryptedPassword = credentials.password;
    }

    public getNumberOfRows() {
        this.numberOfRows = Number(this.myLocalStorage.getValue(this.constants.NUMBER_OF_ROWS));
        if (!this.numberOfRows) {
            this.numberOfRows = 5;
        }
    }

    getValidateCredentialUrl(username: string, password: string, app_mode: string) {
        return this.getBaseUrl(app_mode) + "I1=" + username + "&I2=" + password + "&I3=systemIdentity";
    }

    getForgotPasswordUrl(email: string, app_mode: string) {
        return this.getBaseUrl(app_mode) + "I3=systemEmailPassword&User=" + email;
    }

    getTopAgentsUrl(type, page_no: number, app_mode: string) {

        return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=agentsNprActualToPlanGet&PageNum=" + page_no + "&NoOfRows=" + this.numberOfRows + "&NprSortOrder=" + type;
    }

    getSearchedProfileUrl(app_mode: string, stateId: string, type: string, pageNum: number, searchString: string) {

        return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=profileSearch&stateId=" + stateId + "&Type=" + type + "&PageNum=" + pageNum + "&NoOfRows=" + this.numberOfRows + "&searchString=" + searchString;
    }


    getSearchedProfileForTagAndNonTagUrl(app_mode: string, stateId: string, type: string, pageNum: number, searchString: string) {

        return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=entityProfileSearch&stateId=" + stateId + "&Type=" + type + "&PageNum=" + pageNum + "&NoOfRows=" + this.numberOfRows + "&searchString=" + searchString;
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

        return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=agentNotesGet&AgentID=" + entityId + "&Seq=0";
    }
    getPersonNotesUrl(app_mode: string, uid: string, entityType: string, entityId: string, pageNum: any) {

        return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=systemNotesGet&UID=ALL&entity=P&entityID=" + entityId + "&PageNum=1&NoOfRows=20";
    }

    getUpdateSentimentUrl(app_mode: string) {
        return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=sentimentModify";
    }

    getCreateSentimentUrl(app_mode: string) {
        return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=sentimentNew";

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

    getViewSentimentHistoryUrl(app_mode: string, stat: string, entity: any, entityId: any, type: string, pageNum: any) {
        return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=userObjectivesGet&entity=" + entity + "&entityID=" + entityId + "&stat=" + stat + "&type=" + type + "&PageNum=" + pageNum + "&NoOfRows=" + this.numberOfRows + "&OtherApp=yes&NeedInteractions=no";
    }

    getPersonAffiliationsUrl(app_mode: string, entityId: string, pageNum: number) {
        return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=affiliatedpersonGet&PersonID=" + entityId + "&PageNum=" + pageNum + "&NoOfRows=" + this.numberOfRows;
    }

    getEntityContactDetailUrl(app_mode: string, entityType: string, entityId: string) {
        return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=ContactGet&entity=" + entityType + "&entityID=" + entityId;
    }

    getAgentJournalsUrl(app_mode: string, entityID: string){
        return this.getDoWebURL(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=AgentJournalsGet&AgentID=" + entityID;
    }

    getModifyAgentJournalUrl(app_mode: string){
        return this.getDoWebURL(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=AgentJournalModify"; 
    }
    getAgentPerformanceUrl(app_mode: string, pageNum: number) {
        return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=agentsPerformanceGet&PageNum=" + pageNum + "&NoOfRows=" + this.numberOfRows;
    }

    getUpdateEntityProfileUrl(app_mode: string) {
        return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=contactModify";
    }

    getAddPersonEntityUrl(app_mode: string) {
        return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=personNew";
    }    

    getThirteenMonthActivityUrl(app_mode: string, agentId: string) {
        return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=Activity13MonthsGet&agentId=" + agentId;
    }

    getDeleteNoteUrl(app_mode: string, noteId: string) {
        return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=userNoteDelete&sysNoteID=" + noteId;
    }

    getCreateNoteUrl(app_mode: string, entityId, Notes, summary, selectedCategory) {

        return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=agentNoteNew&AgentID=" + entityId + "&Category=" + selectedCategory + "&Subject=" + summary + "&NoteType=1&Notes=" + Notes;
    }
    getCreatePersonNoteUrl(app_mode: string, entityId, Notes, summary, selectedCategory) {

        return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=userNoteNew";
    }
    getUpdatePersonNoteUrl(app_mode: string, agentId, Notes, summary, seq, selectedCategory) {
        return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=userNoteModify";
    }
    getUpdateNoteUrl(app_mode: string, agentId, Notes, summary, seq, selectedCategory) {
        return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=agentNoteModify&AgentID=" + agentId + "&Seq=" + seq + "&Category=" + selectedCategory + "&Subject=" + summary + "&NoteType=1&Notes=" + Notes;
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
        return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=userObjectivesGet&entity=" + entity + "&entityID=" + entityId + "&stat=" + stat + "&type=" + type + "&PageNum=" + pageNum + "&NoOfRows=" + this.numberOfRows;
    }

    getPersonListUrl(app_mode: string, agentState, agentID) {
        return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=agentAffiliationsGet&stateID=" + agentState + "&agentID=" + agentID;

    }
    getUpdateObjectiveUrl(app_mode: string) {
        return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=userObjectiveModify";
    }

    createObjectiveUrl(app_mode: string) {
        return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=userObjectiveNew";
    }

    getUpdateTagUrl(app_mode: string) {
        return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=userTagModify";
    }

    getDeleteTagUrl(app_mode: string) {
        return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=entityUntag";
    }

    getEventsListUrl(app_mode: string, entityType: any, entityId: any) {
        return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=eventsGet&entity=" + entityType + "&entityID=" + entityId;
    }

    getResetApplicationSetting(app_mode: string) {
        return this.getBaseUrl(app_mode) + "I1=" + this.email + "&I2=" + this.encryptedPassword + "&I3=appSettingsReset&appCode=CRM&ObjAction=userConfig";
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
        //this.getServerURL();
        return this.API_BASE_URL + app_mode + "/act?I0=JSON&I4=CRM&";
    }

    private getDoWebURL(app_mode: string){
        this.checkAndGetCredentials();
        this.getNumberOfRows();
        //this.getServerURL();
        return this.API_BASE_URL + app_mode + "/doweb?I0=JSON&I4=CRM&";
    }
}
