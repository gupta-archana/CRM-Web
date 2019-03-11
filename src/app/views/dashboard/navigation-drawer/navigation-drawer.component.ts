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
  exit: boolean = false;
  called: boolean = false;
  functionCalled: any;
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    alert("leaving message");
  }
  constructor(public apiHandler: ApiHandlerService,
    public changeDetector: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private commonFunctions: CommonFunctionsService,
    public router: Router,
    private myLocalStorage: MyLocalStorageService,
    public constants: Constants,
    private dataService: DataServiceService,
    private activeRoute: ActivatedRoute,
    private location: PlatformLocation) { }

  ngOnInit() {
    let self = this;
    getSideNavData(self);
    console.log($);

    // this.handleBackpressEvent();
    // window.onbeforeunload = ev => {
    //   console.log(ev);
    //   this.removeBackpressEventListener();
    // }
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

  ngOnDestroy(): void {
    if (this.activatedRouteSubscription && !this.activatedRouteSubscription.closed)
      this.activatedRouteSubscription.unsubscribe();
  }
  handleBackpressEvent() {
    history.pushState(null, null, location.href);
    var self = this;
    this.functionCalled = this.onPopState.bind(this);
    window.addEventListener("popstate", this.functionCalled, true);
  }

  removeBackpressEventListener() {
    window.removeEventListener("popstate", this.functionCalled, true);
  }

  private onPopState(ev: PopStateEvent) {
    var self = this;
    ev.preventDefault();
    //if (ev.state) {
    if (self.activeRoute.firstChild.component == NavigationDrawerComponent || self.activeRoute.firstChild.component == LoginComponent) {
      if (!self.called) {
        self.called = true;
        if (self.exit) {
          self.exit = !self.exit;
          for (let i = 0; i < history.length; i++) {
            self.location.back();
          }
        }
        else {
          self.onFirstBackClick(self);
        }
      }
      else {
        self.called = false;
      }
    }
    //  }
  }

  private onFirstBackClick(self: this) {
    self.exit = !self.exit;
    self.commonFunctions.showSnackbar("Press back again to exit");
    self.setDefault();
    history.go(1);
  }

  private setDefault() {
    setTimeout(() => {
      this.called = false;
      this.exit = false;
    }, 5000);
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
    default:
      break;
  }
  context.router.navigate([selectedNavBarItemPath], { replaceUrl: true });
  changeHeaderTitle(selectedNavBarItemPath, context);
  context.closeNav();
}

function changeHeaderTitle(path: string, context: NavigationDrawerComponent) {
  if (path) {
    switch (path) {
      case paths.PATH_TOP_AGENTS:
        context.headerTitle = context.constants.TOP_AGENTS;
        break;
      case paths.PATH_AGENTS_WITH_ALERT:
        context.headerTitle = context.constants.AGENTS_WITH_ALERT;
        break;
      case paths.PATH_AGENTS_WITH_PERFORMANCE:
        context.headerTitle = context.constants.AGENTS_WITH_PERFORMANCE;
        break;
      case paths.PATH_AGENT_DETAIL:
        context.headerTitle = context.constants.AGENT_DETAIL;
        break;
      default:
        break;
    }
  }
}