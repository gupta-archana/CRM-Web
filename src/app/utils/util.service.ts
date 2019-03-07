import { Injectable } from '@angular/core';
import { NavigationDrawerComponent } from '../views/dashboard/navigation-drawer/navigation-drawer.component';
import { LoginComponent } from '../views/login/login.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PlatformLocation, LocationStrategy } from '@angular/common';
import { MatSnackBar } from '@angular/material';
import { CommonFunctionsService } from './common-functions.service';
@Injectable({
  providedIn: 'root'
})
export class UtilService {
  exit: boolean = false;
  called: boolean = false;
  constructor(private location: PlatformLocation,
    private activeRoute: ActivatedRoute,
    private commonFunctions: CommonFunctionsService) { }

  handleBackpressEvent() {
    history.pushState(null, null, location.href);
    var self = this;
    window.addEventListener("popstate", function () {
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
    }, true);
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
