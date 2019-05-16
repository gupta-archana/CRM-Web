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

  favorites: Array<UserFavoriteModel> = new Array();
  constructor(private injector: Injector) { super(injector); }

  ngOnInit() {

    this.apiHandler.getUserFavorites(this);
  }
  onSuccess(response: any) {
    this.favorites = response.sysfavorite;
    this.cdr.markForCheck();
  }
  onError(errorCode: number, errorMsg: string) {

  }
}
