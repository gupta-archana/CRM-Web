import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class MyLocalStorageService {
  salt: string = "AlliantNational";
  constructor() { }

  public setValue(key: string, value: any) {

    localStorage.setItem(key, value);
  }
  public getValue(key: string) {
    return localStorage.getItem(key);
  }
}
