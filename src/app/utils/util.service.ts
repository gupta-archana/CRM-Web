import { Injectable } from '@angular/core';
import { NavigationDrawerComponent } from '../views/dashboard/navigation-drawer/navigation-drawer.component';
import { LoginComponent } from '../views/login/login.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, Event as NavigationEvent } from '@angular/router';
import createHistory from 'history/createBrowserHistory'
import { PlatformLocation, LocationStrategy } from '@angular/common';
import { MatSnackBar } from '@angular/material';
import { CommonFunctionsService } from './common-functions.service';
import { RoutingStateService } from '../services/routing-state.service';
import * as paths from 'src/app/Constants/paths';
import { filter } from 'rxjs/operators';
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
    private router: Router) { }

  handleBackpressEvent() {
    history.pushState(null, null, location.href);

    this.regsiterAndListenNavigationEvent();
    this.router.events
      .pipe(filter((event: NavigationEvent) => {
        return (event instanceof NavigationStart);
      }
      )
      )
      .subscribe(
        (event: NavigationStart) => {
          console.group("NavigationStart Event");
          console.log("navigation id:", event.id);
          console.log("route:", event.url);
          console.log("trigger:", event.navigationTrigger);
          if (event.restoredState) {
            console.warn(
              "restoring navigation id:",
              event.restoredState.navigationId
            );
          }
          console.groupEnd();

        }
      )
      ;



    // this.functionCalled = this.onPopState.bind(this);


    //window.addEventListener("popstate", this.functionCalled, true);
  }

  private regsiterAndListenNavigationEvent() {
    var myHistory = createHistory();
    var self = this;
    this.unlisten = myHistory.listen((location, state) => {
      var url = this.router.url.substring(1, this.router.url.length);
      if (paths.sideNavRoutePaths.indexOf(url) >= 0) {
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
      console.log(location);
    });
  }

  removeBackpressEventListener() {
    this.unlisten();
    // window.removeEventListener("popstate", this.functionCalled, true);
  }

  private onPopState(ev: PopStateEvent) {
    // var self = this;
    // ev.preventDefault();
    // this.routingState.loadRouting();
    // this.routingState.getPreviousUrl();
    // //if (ev.state) {
    // if (self.activeRoute.firstChild.component == NavigationDrawerComponent || self.activeRoute.firstChild.component == LoginComponent) {
    //   if (!self.called) {
    //     self.called = true;
    //     // if (self.exit) {
    //     //   self.exit = !self.exit;
    //     //   for (let i = 0; i < history.length; i++) {
    //     //     self.location.back();
    //     //   }
    //     // }
    //     // else {
    //     //   self.onFirstBackClick(self);
    //     // }
    //   }
    //   else {
    //     self.called = false;
    //   }
    // }
    //  }
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


