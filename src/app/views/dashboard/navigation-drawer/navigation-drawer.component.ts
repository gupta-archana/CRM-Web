import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, HostListener } from '@angular/core';
import { ApiHandlerService } from '../../../utils/api-handler.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonFunctionsService } from '../../../utils/common-functions.service';
import { Constants } from '../../../Constants/Constants';
import * as paths from '../../../Constants/paths';
import { MyLocalStorageService } from '../../../services/my-local-storage.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { UtilService } from '../../../utils/util.service';
import { PlatformLocation } from '@angular/common';
import { LoginComponent } from '../../login/login.component';
import * as $ from 'jquery';
import { FormCanDeactivate } from '../../../guards/form-can-deactivate/form-can-deactivate';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../../../customUI/dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-navigation-drawer',
  templateUrl: './navigation-drawer.component.html',
  styleUrls: ['./navigation-drawer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationDrawerComponent implements OnInit, OnDestroy {


  sideNavArray = [];
  headerTitle: string = "";
  activatedRouteSubscription: Subscription = null;
  currentPagePathSubscription: Subscription = null;
  showRefreshButton: boolean = false;
  showFilterButton: boolean = false;
  exit: boolean = false;
  called: boolean = false;
  functionCalled: any;

  constructor(public apiHandler: ApiHandlerService,
    public changeDetector: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    public commonFunctions: CommonFunctionsService,
    public router: Router,
    private myLocalStorage: MyLocalStorageService,
    public constants: Constants,
    public dataService: DataServiceService,
    private activeRoute: ActivatedRoute,
    private location: PlatformLocation,
    private dialog: MatDialog) { }

  ngOnInit() {
    let self = this;
    getSideNavData(self);
    console.log($);
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
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { alertTitle: this.constants.LOGOUT, message: this.constants.ALERT_LOGIUT_CONFIRMATION }
    });

    dialogRef.afterClosed().subscribe(callback => {
      if (callback) {
        this.myLocalStorage.clearValue(this.constants.LOGGED_IN);
        this.commonFunctions.navigateWithReplaceUrl(paths.PATH_LOGIN);
      }
    });
  }

  onRefreshClick() {
    this.dataService.onHeaderRefreshClick();
  }

  onFilterClick() {
    this.dataService.onHeaderFilterClick();
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
      self.changeDetector.markForCheck();
    }, onError(errCode, errMsg) {
    }
  });


}

function navigateToSelectedPage(title: string, context: NavigationDrawerComponent) {
  let selectedNavBarItemPath = "";
  switch (title) {
    case context.constants.TOP_AGENTS:
      selectedNavBarItemPath = paths.PATH_TOP_AGENTS;

      break;
    case context.constants.AGENTS_WITH_ALERT:
      selectedNavBarItemPath = paths.PATH_AGENTS_WITH_ALERT;

      break;
    case context.constants.AGENTS_WITH_PERFORMANCE:
      selectedNavBarItemPath = paths.PATH_AGENTS_WITH_PERFORMANCE;
      break;
    case context.constants.SEARCH:
      selectedNavBarItemPath = paths.PATH_SEARCH;
      break;
    case context.constants.NEWS:
      selectedNavBarItemPath = paths.PATH_NEWS;
      break;
    default:
      break;
  }
  context.commonFunctions.navigateWithReplaceUrl(selectedNavBarItemPath);

  changeHeaderTitle(selectedNavBarItemPath, context);
  context.closeNav();
}


function changeHeaderTitle(path: string, context: NavigationDrawerComponent) {
  if (path) {
    switch (path) {
      case paths.PATH_TOP_AGENTS:
        context.headerTitle = context.constants.TOP_AGENTS;
        showRefreshButton(true, context);
        break;
      case paths.PATH_AGENTS_WITH_ALERT:
        context.headerTitle = context.constants.AGENTS_WITH_ALERT;
        showRefreshButton(true, context);
        break;
      case paths.PATH_AGENTS_WITH_PERFORMANCE:
        showRefreshButton(true, context);
        context.headerTitle = context.constants.AGENTS_WITH_PERFORMANCE;
        break;
      case paths.PATH_AGENT_DETAIL:
        context.headerTitle = context.constants.AGENT_DETAIL;
        break;
      case paths.PATH_NEWS:
        context.headerTitle = context.constants.NEWS;
        showRefreshButton(true, context);
        break;
      case paths.PATH_SEARCH:
        context.headerTitle = context.constants.SEARCH;
        showRefreshButton(false, context);
        break;

      default:
        break;
    }
  }
}
function showRefreshButton(show: boolean, context: NavigationDrawerComponent) {
  if (show) {
    context.showRefreshButton = true;
    context.showFilterButton = false;
  }
  else {
    context.showRefreshButton = false;
    context.showFilterButton = true;
  }
}