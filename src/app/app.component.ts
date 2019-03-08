import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PlatformLocation, LocationStrategy } from '@angular/common';
import { MatSnackBar } from '@angular/material';
import { NavigationDrawerComponent } from './views/dashboard/navigation-drawer/navigation-drawer.component';
import { CommonFunctionsService } from './utils/common-functions.service';
import { Subscription } from 'rxjs';
import { DataServiceService } from './services/data-service.service';
import { LoginComponent } from './views/login/login.component';
import { UtilService } from './utils/util.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {


  title = 'AlliantCRM';
  private _opened: boolean = false;
  exit: boolean = false;
  called: boolean = false;
  loaderSubscription: Subscription = null;
  loading: boolean = false;

  private _toggleSidebar() {
    this._opened = !this._opened;
  }
  constructor(private _route: ActivatedRoute,
    private router: Router,
    private location: PlatformLocation,
    private activeRoute: ActivatedRoute,
    private commonFunctions: CommonFunctionsService,
    private snackBar: MatSnackBar,
    public dataService: DataServiceService,
    private utils: UtilService) {

  }

  ngOnInit(): void {
    this.utils.handleBackpressEvent();
    window.onbeforeunload = ev => {
      console.log(ev);
      this.utils.removeBackpressEventListener();
    }
    registerHideShowLoaderBroadcast(this);
  }

  ngOnDestroy(): void {
    if (this.loaderSubscription != null && !this.loaderSubscription.closed) {
      this.loaderSubscription.unsubscribe();
    }
  }

}
function registerHideShowLoaderBroadcast(context: AppComponent) {
  context.loaderSubscription = context.dataService.hideShowLoaderObservable.subscribe(
    showLoader => {
      context.loading = showLoader;
    }
  );
}
