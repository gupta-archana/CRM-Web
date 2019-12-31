import { Injectable } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Constants } from '../Constants/Constants';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { MyLocalStorageService } from '../services/my-local-storage.service';
import * as paths from '../Constants/paths';
import { EntityModel } from '../models/entity-model';
import { DataServiceService } from '../services/data-service.service';

@Injectable({
  providedIn: 'root'
})

export class CommonFunctionsService {
  private activeToast: any = null;
  public static config: MatSnackBarConfig;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private constants: Constants,
    private myLocalStorage: MyLocalStorageService,
    private dataService: DataServiceService,
    public snackBar: MatSnackBar) {
    createSnackbarConfig(this);

  }
  printLog(message: any, show?: boolean) {
    if (show == undefined || show == true)
      console.log(message);

  }

  showSnackbar(message: string) {
    this.toastr.success(message);

  }

  showErrorSnackbar(message: string) {
    this.toastr.error(message);

  }

  showPermanentSnackbar(message: string) {
    if (!this.activeToast) {
      this.activeToast = this.toastr.info(message, null, {
        disableTimeOut: true,
        positionClass: "toast-bottom-center",

      });
    } else {
      this.activeToast.message = message;
    }
  }

  navigateWithReplaceUrl(path: string) {
    this.router.navigate([path], { replaceUrl: true });
    // setTimeout(() => {
    //   window.location.reload(true);
    // }, 200);
    //
  }

  navigateWithoutReplaceUrl(path: string) {
    this.router.navigate([path]);
  }
  getEncryptedPassword(pUnencrypted: string) {
    //pUnencrypted = "TestingPassword"
    let passwordCeilingNumber = Math.ceil(pUnencrypted.length / 26);
    let tLength: number = passwordCeilingNumber + 3;
    let encryptedPass = new Array<any>(tLength + Math.max(pUnencrypted.length, 128));
    let tStart = getRandomInt(1, 26);
    //let tStart = 11;
    encryptedPass[0] = (tStart + 96);
    let tOffset = getRandomInt(1, 26);
    //let tOffset = 19;
    encryptedPass[1] = (tOffset + 96);
    for (let i = 0; i < passwordCeilingNumber; i++) {
      encryptedPass[i + 2] = (pUnencrypted.substr((i * 26), 26).length + 96);
    }
    encryptedPass[tLength - 1] = ("=".charCodeAt(0));
    for (let i = tLength; i < tStart + tLength - 1; i++) {
      if (getRandomInt(1, 2) == 1) {
        encryptedPass[i] = (getRandomInt(97, 122));
      } else {
        encryptedPass[i] = (getRandomInt(65, 90));
      }

    }

    tLength = tStart + tLength - 1;
    for (let i = 0; i < pUnencrypted.length; i++) {
      let tAsc = (pUnencrypted.substr(i, 1)).charCodeAt(0);
      if (tAsc >= 65 && tAsc <= 90) {
        tAsc = tAsc + tOffset;
        if (tAsc > 90) {
          tAsc = tAsc - 26;
        }
      }
      if (tAsc >= 97 && tAsc <= 122) {
        tAsc = tAsc + tOffset;
        if (tAsc > 122)
          tAsc = tAsc - 26;
      }
      encryptedPass[tLength + i] = (tAsc);
    }
    tLength = tLength + pUnencrypted.length;
    for (let i = tLength; i < encryptedPass.length; i++) {
      if (getRandomInt(1, 2)) {
        encryptedPass[i] = (getRandomInt(97, 122));
      }
      else {
        encryptedPass[i] = (getRandomInt(65, 90));
      }

    }
    //this.printLog(encryptedPass, true);
    let encryptedString = btoa(String.fromCharCode.apply(null, new Uint8Array(encryptedPass)));
    let decryptedPass = atob(encryptedString);
    decryptedPass = decryptedPass.charCodeAt.call(decryptedPass, 0);
    return encryptedString;

  }

  backPress() {
    window.history.back();
  }

  hideShowTopScrollButton(document: Document) {
    let self = this;
    window.onscroll = function() { self.scrollFunction(document) };
  }
  private scrollFunction(doc: Document) {
    let element: HTMLElement = document.getElementById("myBtn");
    if (element) {
      if (doc.body.scrollTop > 20 || doc.documentElement.scrollTop > 20) {
        element.style.display = "block";
      } else {
        element.style.display = "none";
      }
    }
  }
  topFunction(doc: Document) {
    doc.body.scrollTop = 0;
    doc.documentElement.scrollTop = 0;
  }

  getLoginCredentials() {
    let emailId = this.myLocalStorage.getValue(this.constants.EMAIL);
    let encryptedPassword = this.getEncryptedPassword(this.myLocalStorage.getValue(this.constants.PASSWORD));

    let credentialsObject = {
      "email": emailId,
      "password": encryptedPassword
    }
    return credentialsObject;
  }

  showMoreDataSnackbar(data: any[], currentAvailable: any) {
    let totalAndCurrentRowsRatio: string = "";
    if (data && data.length > 0) {
      totalAndCurrentRowsRatio = "showing " + data.length + " out of " + currentAvailable;
    }
    else {
      totalAndCurrentRowsRatio = "No Data available";
    }
    return totalAndCurrentRowsRatio;

    //this.snackBar.open(totalAndCurrentRowsRatio, null, CommonFunctionsService.config);
    //this.showPermanentSnackbar(totalAndCurrentRowsRatio);
  }

  onMenuItemClick(item, entityModel: EntityModel) {

    let navigatingUrl = "";
    //let value = item.title == paths.AGENT_DETAIL_THIRTEEN_MONTH_ACTIVITY
    switch (item.title) {
      case this.constants.AGENT_DETAIL_CONTACT:
        navigatingUrl = paths.PATH_AGENT_CONTACT_DETAIL;
        break;
      case this.constants.AGENT_DETAIL_NOTES:
        navigatingUrl = paths.PATH_NOTES;
        break;
      case this.constants.AGENT_DETAIL_ASSOCIATES:
        navigatingUrl = paths.PATH_AGENT_ASSOCIATES;
        break;
      case this.constants.AGENT_DETAIL_THIRTEEN_MONTH_ACTIVITY:
        navigatingUrl = paths.PATH_THIRTEEN_MONTH_ACTIVITY;
        break;
      case this.constants.AGENT_DETAIL_OBJECTIVE:
        navigatingUrl = paths.PATH_AGENT_OBJECTIVE;
        break;
      case this.constants.AGENT_DETAIL_EVENTS:
        navigatingUrl = paths.PATH_AGENT_DETAIL;
        break;
      case this.constants.AGENT_DETAIL_TAGS:
        navigatingUrl = paths.PATH_AGENT_TAGS;

        break;
      case this.constants.AGENT_DETAIL_COMPLIANCE:
        navigatingUrl = paths.PATH_AGENT_COMPLIANCE;
        break;
      case this.constants.AGENT_DETAIL_ALERTS:
        navigatingUrl = paths.PATH_OPEN_ALERTS;
        break;

      case this.constants.AGENT_DETAIL_CLAIMS:
        navigatingUrl = paths.PATH_CLAIMS;
        break;
      case this.constants.AGENT_DETAIL_SOCIAL:

        break;
      case this.constants.AGENT_DETAIL_EMAILS:

        break;
      case this.constants.AGENT_DETAIL_AUDITS:
        navigatingUrl = paths.PATH_AGENT_AUDITS;
        break;
      case this.constants.PERSON_AGENT:
        sessionStorage.setItem(this.constants.INTERNAL_ENTITY_MODEL, JSON.stringify(entityModel));
        navigatingUrl = paths.PATH_PERSON_AGENTS;
        break;

      default:
        break;
    }

    if (navigatingUrl) {
      this.navigateWithoutReplaceUrl(navigatingUrl);
    }

    else
      this.showErrorSnackbar("We are working on it");
  }

  setFavoriteOnApisResponse(item: EntityModel) {
    if (item.favorite == "yes") {
      let favAgents: string[] = JSON.parse(sessionStorage.getItem(this.constants.SESSION_FAV_ARRAY));
      if (!favAgents) favAgents = new Array<string>();
      if (favAgents.indexOf(item.entityId) == -1) {
        favAgents.push(item.entityId)
        sessionStorage.setItem(this.constants.SESSION_FAV_ARRAY, JSON.stringify(favAgents));
      }
    }
  }

  setFavoriteToSessionArray(entityId) {
    let favAgents: string[] = JSON.parse(sessionStorage.getItem(this.constants.SESSION_FAV_ARRAY));
    if (!favAgents) favAgents = new Array<string>();
    if (this.checkFavorite(entityId))
      favAgents.push(entityId)
    else
      favAgents.splice(favAgents.indexOf(entityId), 1);
    sessionStorage.setItem(this.constants.SESSION_FAV_ARRAY, JSON.stringify(favAgents));
  }

  checkFavorite(entityId) {
    let favAgents: string[] = JSON.parse(sessionStorage.getItem(this.constants.SESSION_FAV_ARRAY));
    if (favAgents)
      return favAgents.indexOf(entityId) == -1;
    return true;
  }

  public doEmail(emailAddress) {
    var mailContent = "mailto:" + emailAddress;
    window.location.href = mailContent;
  }

  downloadPdf(pdfInBase64: any, fileName: string) {
    const newBlob = new Blob([pdfInBase64], { type: 'application/pdf' });
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob); // For IE browser
    }
    const linkSource = 'data:application/pdf;base64,' + pdfInBase64;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  getCurrentDate(): string {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var todayDate = mm + '/' + dd + '/' + yyyy;
    return todayDate;
  }
  getLastMonthDate(): string {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth()).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var lastMonthDate = mm + '/' + dd + '/' + yyyy;
    return lastMonthDate;
  }

  getAddress(item: EntityModel) {

    let address: string = "";
    address = item.city + ", " + item.state + ", " + item.zip;
    address = address.trim()
    if (address.startsWith(','))
      address = address.substring(1);
    if (address.endsWith(','))
      address = address.substr(0, address.length - 1)
    return address;
  }

  showLoadedItemTagOnHeader(loadedItems: Array<any>, totalItemsCount: any, hide?: boolean) {

    let tag = "";
    if (!hide) {
      if (totalItemsCount)
        tag = "Listing " + loadedItems.length + " of " + totalItemsCount;
      else
        tag = this.constants.NO_DATA_AVAILABLE
    }
    this.dataService.shareLoadedItemsTag(tag)
  }
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function createSnackbarConfig(context: CommonFunctionsService) {
  if (!CommonFunctionsService.config) {
    let config = new MatSnackBarConfig();
    config.verticalPosition = context.verticalPosition;
    config.horizontalPosition = context.horizontalPosition;
    CommonFunctionsService.config = config;
  }
}

function showSnackbarOnScroll(text: string) {

}
