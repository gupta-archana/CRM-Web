import { Injectable } from "@angular/core";
// import {
//   Headers,
//   RequestOptions,
//   ResponseContentType,
//   Response,
// } from "@angular/http";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ApiResponseCallback } from "../Interfaces/ApiResponseCallback";
import { Constants } from "../Constants/Constants";
import { Observable, forkJoin, of } from "rxjs";
import { catchError, timeout } from "rxjs/operators";
import { CommonFunctionsService } from "../utils/common-functions.service";
import { DataServiceService } from "./data-service.service";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private constants: Constants,
    private commonFunctions: CommonFunctionsService,
    public dataService: DataServiceService
  ) {}

  hitGetApi(url, apiResponseCallback: ApiResponseCallback) {
    if (navigator.onLine) {
      const self = this;
      // var headers = new Headers();
      // headers.set('Accept', 'text/json');
      // headers.set('Content-Type', 'text/json');
      // const options = new RequestOptions({
      //   headers: headers,
      //   responseType: ResponseContentType.Text,
      // });
      const headers = new HttpHeaders({ "Content-Type": "application/text" });
      let options = {
        headers: headers,
      };

      // const options = {
      //   headers: new HttpHeaders({
      //     "Content-Type": "application/text",
      //     responseType: "text",
      //   }),
      // };

      this.http
        .get(url, options)
        // .pipe(
        //   timeout(180000),
        //   catchError((e) => {
        //     this.commonFunctions.showErrorSnackbar("Server Timeout");
        //     this.dataService.onHideShowLoader(false);
        //     return of(null);
        //   })
        // )
        .subscribe(
          (result) => {
            if (result) {
              try {
                apiResponseCallback.onSuccess(result);
              } catch (error) {
                apiResponseCallback.onError(101, error.toString());
              }
            } else {
              apiResponseCallback.onError(500, "Error");
            }
          },
          function (error: Response) {
            if (error.status == 0)
              apiResponseCallback.onError(
                error.status,
                self.constants.ERROR_NO_INTERNET_CONNECTON
              );
            else apiResponseCallback.onError(error.status, error.statusText);
          }
        );
    } else {
      apiResponseCallback.onError(
        this.constants.NO_INTERNET_CONNECTION_ERROR_CODE,
        this.constants.ERROR_NO_INTERNET_CONNECTON
      );
    }
  }

  hitPostApi(url, data, apiResponseCallback: ApiResponseCallback) {
    this.http
      .post(url, data)
      .pipe(
        timeout(180000),
        catchError((e) => {
          this.commonFunctions.showErrorSnackbar("Server Timeout");
          this.dataService.onHideShowLoader(false);

          return of(null);
        })
      )
      .subscribe(
        (result) => {
          if (result.status == 200) {
            var json = result.json();
            apiResponseCallback.onSuccess(json);
          } else apiResponseCallback.onError(result.status, result.statusText);
        },
        (error) => {
          apiResponseCallback.onError(400, error.toString());
        }
      );
  }

  // getHttpRequestObservable(url): Observable<Response> {
  //   var headers = new Headers();
  //   headers.set("Accept", "text/json");
  //   headers.set("Content-Type", "text/json");
  //   const options = new RequestOptions({
  //     headers: headers,
  //     responseType: ResponseContentType.Text,
  //   });
  //   return this.http.get(url, options);
  // }

  getHttpRequestObservable(url): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers
      .set("Accept", "text/json")
      .set("Content-Type", "text/json");
    const options = {
      headers: headers,
    };
    return this.http.get(url, options);
  }

  hitMultipleRequest(
    observables: Array<Observable<Response>>,
    apiResponseCallback: ApiResponseCallback
  ) {
    forkJoin(observables).subscribe(
      (responses) => {
        apiResponseCallback.onSuccess(responses);
      },
      (err) => {
        apiResponseCallback.onError(err.status, err.statusText);
      }
    );
  }
}
