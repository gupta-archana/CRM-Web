import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { Event as NavigationEvent, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { BaseClass } from './global/base-class';
import { RoutingStateService } from './services/routing-state.service';

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
    private injector: Injector,
    private routingState: RoutingStateService) {
    super(injector);

    this.checkAndSetUserConfig();
  }

  private checkAndSetUserConfig() {
    if (!this.myLocalStorage.getValue(this.constants.SELECTED_HOME_SCREEN))
      this.myLocalStorage.setValue(this.constants.SELECTED_HOME_SCREEN, this.paths.PATH_SEARCH);
    if (!this.myLocalStorage.getValue(this.constants.SELECTED_SEARCH_IN))
      this.myLocalStorage.setValue(this.constants.SELECTED_SEARCH_IN, this.constants.ENTITY_ALL_PRESENTER);
    if (!this.myLocalStorage.getValue(this.constants.NUMBER_OF_ROWS))
      this.myLocalStorage.setValue(this.constants.NUMBER_OF_ROWS, this.constants.DEFAULT_NUMBER_FO_ROWS);
    if (!this.myLocalStorage.getValue(this.constants.SELECTED_NEWS_FEED))
      this.myLocalStorage.setValue(this.constants.SELECTED_NEWS_FEED, this.constants.GOOGLE_NEWS_FEED);
  }

  ngOnInit(): void {
    this.utils.handleBackpressEvent();
    this.routingState.loadRouting();
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
