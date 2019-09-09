import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { AgentInfoModel } from '../models/TopAgentsModel';
import { UserProfileModel } from '../models/user-profile-model';
import { SearchFilterModel } from '../models/search-filter-model';


@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  private hideShowLoaderSubject = new Subject<boolean>();
  hideShowLoaderObservable = this.hideShowLoaderSubject.asObservable();

  private agentInfoModel: AgentInfoModel;
  private shareAgentInfoSubject = new BehaviorSubject<AgentInfoModel>(this.agentInfoModel);
  shareAgentInfoObservable = this.shareAgentInfoSubject.asObservable();

  private currentPagePathSubject = new BehaviorSubject<string>("");
  currentPagePathObservable = this.currentPagePathSubject.asObservable();

  private pageTitleSubject = new BehaviorSubject<string>("");
  pageTitleObservable = this.pageTitleSubject.asObservable();

  private pageRefreshSubject = new Subject<any>();
  pageRefreshObservable = this.pageRefreshSubject.asObservable();

  private filterSubject = new Subject<any>();;
  filterObservable = this.filterSubject.asObservable();

  private recentProfileSubject = new Subject<any>();
  recentProfileObservable = this.recentProfileSubject.asObservable();

  private injectorSubject = new Subject<any>();;
  injectorObservable = this.injectorSubject.asObservable();

  private editAgentProfileDialogSubject = new Subject<any>();
  editAgentProfileDialogObservable = this.editAgentProfileDialogSubject.asObservable();

  private sideNavItemsSubject = new BehaviorSubject<any>("");
  sideNavItemsSubjectObservable = this.sideNavItemsSubject.asObservable();

  private agentDetailItemsSubject = new BehaviorSubject<any>("");
  agentDetailItemsObservable = this.agentDetailItemsSubject.asObservable();

  private personDetailItemsSubject = new BehaviorSubject<any>("");
  personDetailItemsObservable = this.personDetailItemsSubject.asObservable();


  private shareEntityIdAndTypeSubject = new BehaviorSubject<any>("");
  shareEntityIdAndTypeObservable = this.shareEntityIdAndTypeSubject.asObservable();

  private shareUserProfileSubject = new BehaviorSubject<UserProfileModel>(null);
  shareUserProfileObservable = this.shareUserProfileSubject.asObservable();

  private dataUpdatedSubject = new Subject<boolean>();
  dataUpdatedObservable = this.dataUpdatedSubject.asObservable();

  shareDataSubject = new BehaviorSubject<any>("");
  shareDataObservable = this.shareDataSubject.asObservable();

  private searchFiltersSubject = new Subject<SearchFilterModel>();
  searchFiltersObservable = this.searchFiltersSubject.asObservable();

  private tabSelectedSubject = new BehaviorSubject<number>(0);
  tabSelectedObservable = this.tabSelectedSubject.asObservable();

  private shareUpdateNoteSubject = new Subject<string>();
  shareUpdateNoteObservable = this.shareUpdateNoteSubject.asObservable();

  private shareLoadedItemsSubject = new BehaviorSubject<string>("");
  shareLoadedItemsObservable = this.shareLoadedItemsSubject.asObservable();
  constructor() { }

  onHideShowLoader(showLoader: boolean) {
    this.hideShowLoaderSubject.next(showLoader);
  }

  shareAgentInfo(agentInfo: AgentInfoModel) {
    this.shareAgentInfoSubject.next(agentInfo);
  }

  sendCurrentPagePath(pagePath: string) {
    this.currentPagePathSubject.next(pagePath);
  }

  setCurrentPageTitle(path: string) {
    this.pageTitleSubject.next(path);
  }

  onHeaderRefreshClick() {
    this.pageRefreshSubject.next(true);
  }

  onHeaderFilterClick() {
    this.filterSubject.next(true);
  }

  onRecentProfileClick() {
    this.recentProfileSubject.next();
  }

  onInjectorCreated() {
    this.injectorSubject.next();
  }

  onAgentProfileEditClick(openDialog: any) {
    this.editAgentProfileDialogSubject.next(openDialog);
  }

  sendSideNavData(data: Array<any>) {
    this.sideNavItemsSubject.next(data);
  }

  sendAgentDetailItems(data: Array<any>) {
    this.agentDetailItemsSubject.next(data)
  }

  sendPersonDetailItems(data: Array<any>) {
    this.personDetailItemsSubject.next(data)
  }

  onShareEntityIdAndType(data: any) {
    this.shareEntityIdAndTypeSubject.next(data);
  }

  shareUserProfile(data: UserProfileModel) {
    this.shareUserProfileSubject.next(data);
  }

  onDataUpdated() {
    this.dataUpdatedSubject.next(true);
  }

  onDataShare(data: any) {
    this.shareDataSubject.next(data);
  }

  onSearchFilterApply(filterModel: SearchFilterModel) {
    this.searchFiltersSubject.next(filterModel);
  }

  onTabSelected(index: number) {
    this.tabSelectedSubject.next(index);
  }

  onShareUpdatedNote(note: string) {
    this.shareUpdateNoteSubject.next(note);
  }

  shareLoadedItemsTag(loadedItemsTag: string) {
    this.shareLoadedItemsSubject.next(loadedItemsTag);
  }
}
