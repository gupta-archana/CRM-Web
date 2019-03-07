import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { ApiResponseCallback } from '../Interfaces/ApiResponseCallback';
import { Constants } from '../Constants/Constants';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: Http, private constants: Constants) { }

  hitGetApi(url, apiResponseCallback: ApiResponseCallback) {

    if (navigator.onLine) {
      var self = this;
      var headers = new Headers();
      headers.set('Accept', 'text/json');
      headers.set('Content-Type', 'text/json');
      const options = new RequestOptions({
        headers: headers,
        responseType: ResponseContentType.Text
      });
      this.http.get(url, options)
        .subscribe(result => {
          if (result.status == 200) {
            try {
              var json = result.json();
              apiResponseCallback.onSuccess(json);
            } catch (error) {
              apiResponseCallback.onError(101, error.toString());

            }
          }
          else
            apiResponseCallback.onError(result.status, result.statusText);

        }, function (error: Response) {
          if (error.status == 0)
            apiResponseCallback.onError(error.status, self.constants.ERROR_NO_INTERNET_CONNECTON);
          else
            apiResponseCallback.onError(error.status, error.statusText);
        });
    }
    else {
      apiResponseCallback.onError(this.constants.NO_INTERNET_CONNECTION_ERROR_CODE, this.constants.ERROR_NO_INTERNET_CONNECTON);
    }
  }

  hitPostApi(url, data, apiResponseCallback: ApiResponseCallback) {
    this.http.post(url, data)
      .subscribe(result => {
        if (result.status == 200)
          apiResponseCallback.onSuccess(result.json());
        else
          apiResponseCallback.onError(result.status, result.statusText);

      }, error => {
        apiResponseCallback.onError(400, error.toString());
      });
  }
}
