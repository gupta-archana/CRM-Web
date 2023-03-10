import { Component, OnInit, Injector, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recent-profile-dialog',
  templateUrl: './recent-profiles.component.html',
  styleUrls: ['./recent-profiles.component.css']
})
export class RecentProfilesComponent extends BaseClass implements OnInit, OnDestroy {

  recentProfileArray: Array<any> = [];
  recentProfileSubscription: Subscription = null;

  @ViewChild("closeRecentProfileModal")
  closeRecentProfileModal: ElementRef;
  mdlSampleIsOpen: any;
  constructor(private injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    var self = this;
    this.recentProfileSubscription = this.dataService.recentProfileObservable.subscribe(data => {
      this.recentProfileArray = JSON.parse(this.myLocalStorage.getValue(this.constants.ENTITY_ARRAY));
      this.openModal(true);
      this.cdr.markForCheck();
    });
  }
  onProfileClick(item) {
    this.closeRecentProfileModal.nativeElement.click();
    sessionStorage.setItem(this.constants.ENTITY_INFO, JSON.stringify(item));
    this.commonFunctions.navigateWithoutReplaceUrl(this.paths.PATH_AGENT_DETAIL);
  }

  private openModal(open: boolean): void {
    this.mdlSampleIsOpen = open;
  }

  ngOnDestroy(): void {
    if (this.recentProfileSubscription && !this.recentProfileSubscription.closed) {
      this.recentProfileSubscription.unsubscribe();

    }
  }

}
