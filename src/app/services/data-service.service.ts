import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { AgentInfoModel } from '../models/TopAgentsModel';


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

  private injectorSubject = new Subject<any>();;
  injectorObservable = this.injectorSubject.asObservable();

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

  onInjectorCreated() {
    this.injectorSubject.next();
  }
}
