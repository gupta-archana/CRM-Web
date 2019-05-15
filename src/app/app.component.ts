import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, Event as NavigationEvent } from '@angular/router';

import { PlatformLocation, LocationStrategy } from '@angular/common';
import { MatSnackBar } from '@angular/material';
import { NavigationDrawerComponent } from './views/dashboard/navigation-drawer/navigation-drawer.component';
import { CommonFunctionsService } from './utils/common-functions.service';
import { Subscription } from 'rxjs';
import { DataServiceService } from './services/data-service.service';
import { LoginComponent } from './views/login/login.component';
import { UtilService } from './utils/util.service';
import { filter } from 'rxjs/operators';
import { BaseClass } from './global/base-class';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends BaseClass implements OnInit, OnDestroy {


  title = 'AlliantCRM';
  private _opened: boolean = false;
  exit: boolean = false;
  called: boolean = false;
  loaderSubscription: Subscription = null;
  loading: boolean = false;

  private _toggleSidebar() {
    this._opened = !this._opened;
  }
  constructor(private router: Router,
    private injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.utils.handleBackpressEvent();
    sendCurrentPagePath(this, this.router);
    window.onbeforeunload = ev => {
      
      this.utils.removeBackpressEventListener();
    }
    registerHideShowLoaderBroadcast(this);
  }

  ngOnDestroy(): void {
    if (this.loaderSubscription != null && !this.loaderSubscription.closed) {
      this.loaderSubscription.unsubscribe();
    }
  }
  ngAfterViewChecked() {
    
    this.cdr.detectChanges();
  }
}
function registerHideShowLoaderBroadcast(context: AppComponent) {
  context.loaderSubscription = context.dataService.hideShowLoaderObservable.subscribe(
    showLoader => {
      context.loading = showLoader;
    }
  );
}
function sendCurrentPagePath(context: AppComponent, router: Router) {
  router.events
    .pipe(filter((event: NavigationEvent) => {
      return (event instanceof NavigationStart);
    })
    ).subscribe(
      (event: NavigationStart) => {
        let newUrl = event.url.substring(1, event.url.length);
        if (newUrl) {
          context.dataService.sendCurrentPagePath(newUrl);
        }
      });
}
