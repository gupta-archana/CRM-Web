import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, pipe, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { MyLocalStorageService } from './my-local-storage.service';
import { Constants } from '../Constants/Constants';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private message: string;

  constructor(private _router: Router,
    private myLocalStorage: MyLocalStorageService,
    private constants: Constants) { }

  isAuthenticated(): boolean {
    //return false;
    return this.myLocalStorage.getValue(this.constants.LOGGED_IN) != null;
  }

  onLoginSuccess(emailAddress: string, password: string, rememberMe: boolean): void {
    this.myLocalStorage.setValue(this.constants.EMAIL, emailAddress);
    this.myLocalStorage.setValue(this.constants.PASSWORD, password);
    this.myLocalStorage.setValue(this.constants.REMEMBER_ME, rememberMe ? "1" : "0");
    this.myLocalStorage.setValue(this.constants.LOGGED_IN, "1");
    this._router.navigate([''], { replaceUrl: true });
  }
}