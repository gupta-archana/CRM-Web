import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { UserFavoriteModel } from '../../../models/user-favorite-model';
import { EntityModel } from '../../../models/entity-model';
import { CommonApisService } from 'src/app/utils/common-apis.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent extends BaseClass implements OnInit, ApiResponseCallback, OnDestroy {

  pageNumber: number = 0;
  totalRows: any = 0;
  totalAndCurrentRowsRatio: string = "";
  favorites: Array<EntityModel> = new Array();
  moreDataAvailable: boolean = true;
  hideNoDataDiv: boolean = false;
  pageRefreshSubscription: Subscription;
  removeFavSubscription: Subscription;
  errorMsg: string = "";
  constructor(private injector: Injector) { super(injector); }

  ngOnInit() {
    getData(this);
    this.renderUI();
    this.pageRefreshSubscription = this.dataService.pageRefreshObservable.subscribe(called => {
      if (called)
        refreshData(this);
    });
  }
  onLoadMoreClick() {
    makeServerRequest(this);
  }

  getTypeAnnotation(item: EntityModel) {
    return item.type.toLocaleUpperCase();
  }

  onSuccess(response: any) {
    parserResponse(response, this);
    this.renderUI();
  }


  onError(errorCode: number, errorMsg: string) {
    //this.commonFunctions.showErrorSnackbar(errorMsg)
    this.errorMsg = errorMsg;
    this.renderUI();
  }
  getAddress(item: EntityModel) {
    return this.commonFunctions.getAddress(item);
  }

  onStarClick(item: EntityModel, index: number) {
    var self = this;
    this.removeFavSubscription = this.commonApis.setFavorite(item, this.apiHandler, this.cdr).asObservable().subscribe(data => {
      self.unsubscribeRemoveSubscription();
      self.favorites.splice(index, 1);
      self.totalRows--;
      self.renderUI();
    });;
  }

  onItemClick(item: EntityModel) {
    let navigatingPath: string = "";
    switch (item.type) {
      case this.constants.ENTITY_AGENT_PRESENTER:
        navigatingPath = this.paths.PATH_AGENT_DETAIL;
        sessionStorage.setItem(this.constants.ENTITY_INFO, JSON.stringify(item));
        break;
      case this.constants.ENTITY_PERSON_PRESENTER:
        navigatingPath = this.paths.PATH_PERSON_DETAIL;
        sessionStorage.setItem(this.constants.ENTITY_INFO, JSON.stringify(item));
        break;
      default:
        break;
    }
    if (navigatingPath) {
      setData(this);
      this.commonFunctions.navigateWithoutReplaceUrl(navigatingPath);
    }
    else
      this.commonFunctions.showErrorSnackbar("We are working on employee ui");
  }


  public renderUI() {
    checkMoreDataAvailable(this);
    setData(this);
    checkAndSetUi(this);
    updateRatioUI(this);
    this.cdr.markForCheck();
  }


  ngOnDestroy(): void {
    if (this.pageRefreshSubscription && !this.pageRefreshSubscription.closed) {
      this.pageRefreshSubscription.unsubscribe();
    }
    this.unsubscribeRemoveSubscription();
  }

  private unsubscribeRemoveSubscription() {
    if (this.removeFavSubscription && !this.removeFavSubscription.closed) {
      this.removeFavSubscription.unsubscribe();
    }
  }
}



function makeServerRequest(context: FavoritesComponent) {
  context.pageNumber++;
  context.apiHandler.getUserFavorites(context, context.pageNumber);
}

function parserResponse(response: any, context: FavoritesComponent) {
  let favorites = response.sysfavorite;
  favorites.forEach(element => {
    if (element.type != "TotalFavorite") {
      context.commonFunctions.setFavoriteOnApisResponse(element);
      context.favorites.push(element);
    }
    else {
      context.totalRows = element.rowNum;
    }
  });
}

function setData(context: FavoritesComponent) {
  sessionStorage.setItem(context.constants.FAVORITE_ARRAY, JSON.stringify(context.favorites));
  sessionStorage.setItem(context.constants.FAVORITE_PAGE_NUMBER, JSON.stringify(context.pageNumber));
  sessionStorage.setItem(context.constants.FAVORITE_TOTAL_ROWS, context.totalRows);
}

function getData(context: FavoritesComponent) {
  // let favArray = JSON.parse(sessionStorage.getItem(context.constants.FAVORITE_ARRAY));
  // if (favArray) {
  //   context.favorites = favArray;
  //   context.pageNumber = Number(sessionStorage.getItem(context.constants.FAVORITE_PAGE_NUMBER));
  //   context.totalRows = Number(sessionStorage.getItem(context.constants.FAVORITE_TOTAL_ROWS));
  //   context.renderUI();
  // }
  
    makeServerRequest(context);

}

function checkMoreDataAvailable(context: FavoritesComponent) {
  if ((!context.favorites && context.favorites.length == 0) || context.favorites.length >= context.totalRows)
    context.moreDataAvailable = false;
  else
    context.moreDataAvailable = true;
}
function updateRatioUI(context: FavoritesComponent) {
  context.commonFunctions.showLoadedItemTagOnHeader(context.favorites, context.totalRows);
  context.cdr.markForCheck();
}

function checkAndSetUi(context: FavoritesComponent) {
  if (!context.favorites || context.favorites.length == 0) {
    resetData(context);
  }
  else {
    context.hideNoDataDiv = true;
  }
  context.cdr.markForCheck();
}

function refreshData(context: FavoritesComponent) {
  resetData(context)
  makeServerRequest(context);
}

function resetData(context: FavoritesComponent) {
  context.pageNumber = 0;
  context.favorites = [];
  context.totalRows = 0;
  context.moreDataAvailable = false;
  context.hideNoDataDiv = false;
}

