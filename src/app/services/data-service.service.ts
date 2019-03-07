import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  private hideShowLoaderSubject = new Subject<boolean>();
  hideShowLoaderObservable = this.hideShowLoaderSubject.asObservable();
  constructor() { }

  onHideShowLoader(showLoader: boolean) {
    this.hideShowLoaderSubject.next(showLoader);
  }
}
