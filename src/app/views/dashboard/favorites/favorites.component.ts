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
  pageRefreshSubscription: Subscription;

  constructor(private injector: Injector, private commonApis: CommonApisService) { super(injector); }

  ngOnInit() {
    getData(this);
    this.updateRatioUI();
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
    checkMoreDataAvailable(this);
    setData(this);
    this.updateRatioUI();
    this.cdr.markForCheck();
  }
  onError(errorCode: number, errorMsg: string) {

  }
  private updateRatioUI() {
    this.totalAndCurrentRowsRatio = this.commonFunctions.showMoreDataSnackbar(this.favorites, this.totalRows);
    this.cdr.markForCheck();
  }

  onStarClick(item: EntityModel, index: number) {
    var self = this;
    this.commonApis.setFavorite(item, this.apiHandler, this.cdr).asObservable().subscribe(data => {
      self.favorites.splice(index, 1);
      this.totalRows--;
      this.updateRatioUI();
      setData(this);
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

        break;
      default:
        break;
    }
    if (navigatingPath) {
      setData(this);
      this.commonFunctions.navigateWithoutReplaceUrl(navigatingPath);
    }
    else
      this.commonFunctions.showErrorSnackbar("We are working on person ui");
  }

  ngOnDestroy(): void {
    if (this.pageRefreshSubscription && !this.pageRefreshSubscription.closed) {
      this.pageRefreshSubscription.unsubscribe();
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
  let favArray = JSON.parse(sessionStorage.getItem(context.constants.FAVORITE_ARRAY));
  if (favArray) {
    context.favorites = favArray;
    context.pageNumber = Number(sessionStorage.getItem(context.constants.FAVORITE_PAGE_NUMBER));
    context.totalRows = Number(sessionStorage.getItem(context.constants.FAVORITE_TOTAL_ROWS));
    checkMoreDataAvailable(context);
  }
  else {
    makeServerRequest(context);
  }
}

function checkMoreDataAvailable(context: FavoritesComponent) {
  if (!context.favorites || context.favorites.length == context.totalRows)
    context.moreDataAvailable = false;
  else
    context.moreDataAvailable = true;
}

function refreshData(context: FavoritesComponent) {
  context.pageNumber = 0;
  context.favorites = [];
  makeServerRequest(context);
}


