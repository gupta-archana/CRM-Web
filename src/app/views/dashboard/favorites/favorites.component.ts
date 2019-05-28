import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { UserFavoriteModel } from '../../../models/user-favorite-model';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent extends BaseClass implements OnInit, ApiResponseCallback {
  totalRows: any = 0;
  totalAndCurrentRowsRatio: string = "";
  favorites: Array<UserFavoriteModel> = new Array();
  moreDataAvailable: boolean = true;
  constructor(private injector: Injector) { super(injector); }

  ngOnInit() {

    this.apiHandler.getUserFavorites(this);
  }
  onSuccess(response: any) {
    parserResponse(response, this);
    checkMoreDataAvailable(this);
    this.commonFunctions.showMoreDataSnackbar(this.favorites, this.totalRows);
    this.cdr.markForCheck();
  }
  onError(errorCode: number, errorMsg: string) {

  }
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

function checkMoreDataAvailable(context: FavoritesComponent) {
  if (!context.favorites || context.favorites.length == context.totalRows)
    context.moreDataAvailable = false;
  else
    context.moreDataAvailable = true;
}


