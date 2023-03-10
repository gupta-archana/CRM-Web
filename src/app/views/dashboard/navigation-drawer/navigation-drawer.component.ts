import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, Injector, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BaseClass } from '../../../global/base-class';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { RoutingStateService } from '../../../services/routing-state.service';

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
  sideNavSub: Subscription = null;
  showRefreshButton: boolean = false;
  showFilterButton: boolean = false;
  showRecentProfileButton: boolean = false;
  showLogoutButton: boolean = false;
  exit: boolean = false;
  called: boolean = false;
  functionCalled: any;

  @ViewChild("recentProfile")
  recentProfile: ElementRef;
  constructor(private activatedRoute: ActivatedRoute,
    private injector: Injector,
    public router: Router,
    public ngxSmartModel: NgxSmartModalService,
    public routingStates: RoutingStateService
  ) { super(injector) }

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

  onLogoutClick() {
    const dialogRef = this.openDialogService.showConfirmationDialog(this.constants.LOGOUT, this.constants.ALERT_LOGOUT_CONFIRMATION, this.constants.CANCEL, this.constants.LOGOUT);

    dialogRef.afterClosed().subscribe(callback => {
      if (callback) {
        sessionStorage.clear();
        this.myLocalStorage.clearAll();
        this.commonFunctions.navigateWithReplaceUrl(this.paths.PATH_LOGIN);
      }
    });
  }

  onSettingClick() {
    navigateToSelectedItem(this, this.paths.PATH_SETTING);

  }

  onRefreshClick() {
    this.dataService.onHeaderRefreshClick();
  }

  onFilterClick() {
    this.dataService.onHeaderFilterClick();
  }

  onRecentProfileClick() {
    //navigateToSelectedItem(this, this.paths.PATH_RECENT_PROFILES);
    this.dataService.onRecentProfileClick();
  }

  ngOnDestroy(): void {
    if (this.activatedRouteSubscription && !this.activatedRouteSubscription.closed)
      this.activatedRouteSubscription.unsubscribe();
    if (this.sideNavSub && !this.sideNavSub.closed)
      this.sideNavSub.unsubscribe();
  }
}
function getSideNavData(self: NavigationDrawerComponent) {
  self.sideNavSub = self.utils.getSideNavItems().subscribe(data => {
    console.log("data " + JSON.stringify(data));
    if (data)
      self.sideNavArray = data;
    self.cdr.markForCheck();
  });
}

function navigateToSelectedPage(title: string, context: NavigationDrawerComponent) {

  let selectedNavBarItemPath = "";
  context.commonFunctions.showLoadedItemTagOnHeader([], "");
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
    case context.constants.AGENTS_UNDER_PLAN:
      selectedNavBarItemPath = context.paths.PATH_AGENTS_UNDER_PLAN;
      break;
    case context.constants.SEARCH:
      selectedNavBarItemPath = context.paths.PATH_SEARCH;
      break;
    case context.constants.NEWS:
      selectedNavBarItemPath = context.paths.PATH_NEWS;
      break;
    case context.constants.RECENT_PROFILE:
      selectedNavBarItemPath = context.paths.PATH_RECENT_RPOFILES;
      break;
    case context.constants.FOLLOWING:
      selectedNavBarItemPath = context.paths.PATH_FOLLOWING;
      break;
    case context.constants.NOTIFICATIONS:
      selectedNavBarItemPath = context.paths.PATH_NOTIFICATIONS;
      break;
    case context.constants.LOGOUT:
      context.onLogoutClick();
      break;

    default:
      break;
  }
  navigateToSelectedItem(context, selectedNavBarItemPath);
}


function navigateToSelectedItem(context: NavigationDrawerComponent, selectedNavBarItemPath: string) {
  context.closeNav();
  if (selectedNavBarItemPath) {
    context.commonFunctions.navigateWithReplaceUrl(selectedNavBarItemPath);
    context.routingStates.clearHistory()
    changeHeaderTitle(selectedNavBarItemPath, context);
  }
}

function changeHeaderTitle(path: string, context: NavigationDrawerComponent) {
  if (path && path != context.paths.PATH_LOGIN && path != context.paths.PATH_FORGOT_PASSWORD) {
    reasetHeaderButtons(context);
    //clearSession(context);
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
        case context.paths.PATH_AGENTS_UNDER_PLAN:
          context.headerTitle = context.constants.AGENT_UNDER_PLAN;
          context.showRefreshButton = true;
          break;

        case context.paths.PATH_NEWS:
          context.headerTitle = context.constants.NEWS;
          context.showRefreshButton = true;
          break;
        case context.paths.PATH_SEARCH:
          context.headerTitle = context.constants.SEARCH;
          context.showFilterButton = true;
          break;
        case context.paths.PATH_SETTING:
          context.headerTitle = context.constants.SETTINGS;
          context.showLogoutButton = true;
          break;

        case context.paths.PATH_RECENT_RPOFILES:
          context.headerTitle = context.constants.RECENT_PROFILE;
          context.showRefreshButton = true;
          break;

        case context.paths.PATH_FOLLOWING:
          context.headerTitle = context.constants.FOLLOWING;
          context.showRefreshButton = true;
          break;
        case context.paths.PATH_AGENT_DETAIL:
          context.showRecentProfileButton = true;
          context.headerTitle = context.constants.AGENT_DETAIL;
          break;

        case context.paths.PATH_PERSON_DETAIL:
          context.showRecentProfileButton = true;
          context.headerTitle = context.constants.PERSON_DETAIL;
          break;
        case context.paths.PATH_NOTIFICATIONS:
          context.headerTitle = context.constants.NOTIFICATIONS;
          break;
        default:
          break;
      }

      context.cdr.markForCheck();
    }
  }
}


function reasetHeaderButtons(context: NavigationDrawerComponent) {
  context.showRefreshButton = false;
  context.showFilterButton = false;
  context.showRecentProfileButton = false;
  context.showLogoutButton = false;


}

function printButtonStatus(context: NavigationDrawerComponent, from: any) {
  context.commonFunctions.printLog("from " + from + " refresh button " + context.showRefreshButton + ", Filter Button " + context.showFilterButton + " ,recent profile " + context.showRecentProfileButton);
}


function clearSession(context: NavigationDrawerComponent) {

  let sessionKeys: string[] = context.constants.sessionConstants;
  sessionKeys.forEach(element => {
    sessionStorage.removeItem(element);
  });
}
