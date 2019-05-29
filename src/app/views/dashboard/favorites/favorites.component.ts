import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { UserFavoriteModel } from '../../../models/user-favorite-model';
import { EntityModel } from '../../../models/entity-model';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent extends BaseClass implements OnInit, ApiResponseCallback {
  pageNumber: number = 0;
  totalRows: any = 0;
  totalAndCurrentRowsRatio: string = "";
  favorites: Array<EntityModel> = new Array();
  moreDataAvailable: boolean = true;

  constructor(private injector: Injector) { super(injector); }

  ngOnInit() {
    getData(this);
    this.updateRatioUI();
  }
  onLoadMoreClick() {
    makeServerRequest(this);
  }

  getTypeAnnotation(item: EntityModel) {
    return this.constants.entityArrayObject[item.type].toLocaleUpperCase();
  }
  
  onSuccess(response: any) {
    parserResponse(response, this);
    checkMoreDataAvailable(this);
    saveData(this);
    this.updateRatioUI();
    this.cdr.markForCheck();
  }
  onError(errorCode: number, errorMsg: string) {

  }
  private updateRatioUI() {
    this.totalAndCurrentRowsRatio = this.commonFunctions.showMoreDataSnackbar(this.favorites, this.totalRows);
    this.cdr.markForCheck();
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

function saveData(context: FavoritesComponent) {
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


