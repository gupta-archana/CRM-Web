import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { BaseClass } from '../../../global/base-class';

@Component({
  selector: 'app-navigation-drawer',
  templateUrl: './navigation-drawer.component.html',
  styleUrls: ['./navigation-drawer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationDrawerComponent extends BaseClass implements OnInit, OnDestroy {


  sideNavArray = [];
  headerTitle: string = "";
  activatedRouteSubscription: Subscription = null;
  currentPagePathSubscription: Subscription = null;
  showRefreshButton: boolean = true;
  showFilterButton: boolean = false;
  showRecentProfileButton: boolean = false;
  exit: boolean = false;
  called: boolean = false;
  functionCalled: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private injector: Injector,
    public router: Router) { super(injector) }

  ngOnInit() {
    let self = this;
    getSideNavData(self);

    this.activatedRouteSubscription = this.activatedRoute.paramMap.subscribe(url => {
      changeHeaderTitle(this.activatedRoute.firstChild.routeConfig.path, this);
    });
    this.currentPagePathSubscription = this.dataService.currentPagePathObservable.subscribe(path => {
      changeHeaderTitle(path, this);
    });

  }

  onNavigationItemClick(title) {
    this.commonFunctions.printLog(title, true);
    navigateToSelectedPage(title, this);
  }

  openNav() {
    document.getElementById("mySidenav").style.width = "100%";
  }

  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

  logout() {
    // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //   data: { alertTitle: this.constants.LOGOUT, message: this.constants.ALERT_LOGOUT_CONFIRMATION }
    // });

    // dialogRef.afterClosed().subscribe(callback => {
    //   if (callback) {
    //     this.myLocalStorage.clearValue(this.constants.LOGGED_IN);
    //     this.commonFunctions.navigateWithReplaceUrl(context.paths.PATH_LOGIN);
    //   }
    // });
  }

  onRefreshClick() {
    this.dataService.onHeaderRefreshClick();
  }

  onFilterClick() {
    this.dataService.onHeaderFilterClick();
  }

  onRecentProfileClick() {
    this.dataService.onRecentProfileClick();
  }

  ngOnDestroy(): void {
    if (this.activatedRouteSubscription && !this.activatedRouteSubscription.closed)
      this.activatedRouteSubscription.unsubscribe();
  }
}
function getSideNavData(self: NavigationDrawerComponent) {
  self.apiHandler.getSideNavJson({
    onSuccess(success) {
      self.sideNavArray = success;
      self.cdr.markForCheck();
    }, onError(errCode, errMsg) {
    }
  });


}

function navigateToSelectedPage(title: string, context: NavigationDrawerComponent) {
  clearSearch(context);
  let selectedNavBarItemPath = "";
  switch (title) {
    case context.constants.TOP_AGENTS:
      selectedNavBarItemPath = context.paths.PATH_TOP_AGENTS;

      break;
    case context.constants.AGENTS_WITH_ALERT:
      selectedNavBarItemPath = context.paths.PATH_AGENTS_WITH_ALERT;

      break;
    case context.constants.AGENTS_WITH_PERFORMANCE:
      selectedNavBarItemPath = context.paths.PATH_AGENTS_WITH_PERFORMANCE;
      break;
    case context.constants.SEARCH:
      selectedNavBarItemPath = context.paths.PATH_SEARCH;
      break;
    case context.constants.NEWS:
      selectedNavBarItemPath = context.paths.PATH_NEWS;
      break;
    default:
      break;
  }
  context.commonFunctions.navigateWithReplaceUrl(selectedNavBarItemPath);

  changeHeaderTitle(selectedNavBarItemPath, context);
  context.closeNav();
}


function changeHeaderTitle(path: string, context: NavigationDrawerComponent) {

  reasetHeaderButtons(context);
  if (path) {
    switch (path) {
      case context.paths.PATH_TOP_AGENTS:
        context.headerTitle = context.constants.TOP_AGENTS;
        context.showRefreshButton = true;
        break;
      case context.paths.PATH_AGENTS_WITH_ALERT:
        context.headerTitle = context.constants.AGENTS_WITH_ALERT;
        context.showRefreshButton = true;
        break;
      case context.paths.PATH_AGENTS_WITH_PERFORMANCE:
        context.headerTitle = context.constants.AGENTS_WITH_PERFORMANCE;
        context.showRefreshButton = true;
        break;
      case context.paths.PATH_AGENT_DETAIL:
        context.showRecentProfileButton = true;
        context.headerTitle = context.constants.AGENT_DETAIL;
        break;
      case context.paths.PATH_NEWS:
        context.headerTitle = context.constants.NEWS;
        context.showRefreshButton = true;
        break;
      case context.paths.PATH_SEARCH:
        context.headerTitle = context.constants.SEARCH;
        context.showFilterButton = true;
        break;

      default:
        break;
    }

    context.cdr.markForCheck();
  }
}
function showButtonOnHeader(showThisButton: boolean) {
  showThisButton = true;

}

function reasetHeaderButtons(context: NavigationDrawerComponent) {
  context.showRefreshButton = false;
  context.showFilterButton = false;
  context.showRecentProfileButton = false;
}



function clearSearch(context: NavigationDrawerComponent) {
  sessionStorage.removeItem(context.constants.SEARCH_CURRENT_PAGE_NO);
  sessionStorage.removeItem(context.constants.SEARCHED_ENTITY_ARRAY);
  sessionStorage.removeItem(context.constants.SEARCHED_STRING);
  sessionStorage.removeItem(context.constants.SEARCH_MORE_DATA_AVAILABLE_FLAG);

}