import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ApiHandlerService } from '../../../utils/api-handler.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { TopAgentsComponent } from '../top-agents/top-agents.component';
import { AgentWithAlertComponent } from '../agent-with-alert/agent-with-alert.component';
import { Subscription } from 'rxjs';
import { CommonFunctionsService } from '../../../utils/common-functions.service';
import { Constants } from '../../../Constants/Constants';
import * as paths from '../../../Constants/paths';

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

  constructor(public apiHandler: ApiHandlerService,
    public changeDetector: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private commonFunctions: CommonFunctionsService,
    public router: Router,
    public constants: Constants) { }

  ngOnInit() {
    let self = this;
    getSideNavData(self);
    this.activatedRouteSubscription = this.activatedRoute.paramMap.subscribe(url => {
      changeHeaderTitle(this.activatedRoute.firstChild.routeConfig.path, this);
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
  //changeHeaderTitle(title, context);
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
      default:
        break;
    }
  }
}