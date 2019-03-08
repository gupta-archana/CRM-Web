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
}
