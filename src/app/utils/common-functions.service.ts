import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class CommonFunctionsService {

  constructor(
    private snackBar: MatSnackBar,
    private toastr: ToastrService,
    private router: Router) { }
  printLog(message: any, show: boolean) {

    if (show)
      console.log(message);

  }

  showSnackbar(message: string) {
    this.toastr.success(message);

  }

  showErrorSnackbar(message: string) {
    this.toastr.error(message);

  }

  navigateWithReplaceUrl(path: string) {
    this.router.navigate([path], { replaceUrl: true });
    setTimeout(() => {
      window.location.reload(true);
    }, 200);
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
    this.printLog(encryptedPass, true);
    let encryptedString = btoa(String.fromCharCode.apply(null, new Uint8Array(encryptedPass)));
    let decryptedPass = atob(encryptedString);
    decryptedPass = decryptedPass.charCodeAt.call(decryptedPass, 0);
    return encryptedString;

  }

  backPress() {
    window.history.back();
  }

  hideShowTopScrollButton() {
    let self = this;
    window.onscroll = function () { self.scrollFunction() };
  }
  private scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      document.getElementById("myBtn").style.display = "block";
    } else {
      document.getElementById("myBtn").style.display = "none";
    }
  }
  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
