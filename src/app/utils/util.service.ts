import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import createHistory from 'history/createBrowserHistory'
import { PlatformLocation, LocationStrategy } from '@angular/common';
import { CommonFunctionsService } from './common-functions.service';
import { RoutingStateService } from '../services/routing-state.service';
import * as paths from 'src/app/Constants/paths';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  exit: boolean = false;
  called: boolean = false;
  functionCalled: any;
  unlisten: any;
  constructor(private location: PlatformLocation,
    private activeRoute: ActivatedRoute,
    private commonFunctions: CommonFunctionsService,
    private routingState: RoutingStateService,
    private router: Router, ) { }

  handleBackpressEvent() {
    history.pushState(null, null, location.href);
    this.regsiterAndListenNavigationEvent();

  }

  private regsiterAndListenNavigationEvent() {
    var myHistory = createHistory();
    var self = this;
    this.unlisten = myHistory.listen((location, state) => {
      var newUrl = location.pathname.substring(1, this.location.pathname.length);
      var url = this.router.url.substring(1, this.router.url.length);
      if (paths.sideNavRoutePaths.indexOf(url) >= 0 && (newUrl == "" || paths.sideNavRoutePaths.indexOf(newUrl) >= 0)) {
        if (!self.called) {
          self.called = true;
          if (!self.exit) {
            self.onFirstBackClick(self);
          }
          else {
            for (let i = 0; i < history.length; i++) {
              self.location.back();
            }
          }
        }
        else {
          self.called = false;
        }
      }
    });
  }

  removeBackpressEventListener() {
    if (this.unlisten)
      this.unlisten();

  }



  private onFirstBackClick(self: this) {
    self.exit = true;
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


