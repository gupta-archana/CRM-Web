import { Injectable } from '@angular/core';
import { UserModel } from '../models/UserModel';

@Injectable({
  providedIn: 'root'
})
export class LoginParserService {
  private userModel: UserModel;
  constructor() { }
  parseLogin(response: Object[]) {
    this.userModel = new UserModel();
    for (let obj of response) {
      console.log("object:", obj);
      for (let key in obj) {
        switch (key) {
          case "currentUserName":
            this.userModel.currentUserName = obj[key];
            break;
          case "currentUserInitials":
            this.userModel.currentUserInitials = obj[key];
            break;
          case "currentUserEmail":
            this.userModel.currentUserEmail = obj[key];
            break;
          case "currentPasswordSetDate":
            this.userModel.currentPasswordSetDate = obj[key];
            break;
          case "currentPasswordExpireDate":
            this.userModel.currentPasswordExpireDate = obj[key];
            break;
          case "currentPasswordExpired":
            this.userModel.currentPasswordExpired = obj[key];
            break;
          case "currentPasswordWarnDays":
            this.userModel.currentPasswordWarnDays = obj[key];
            break;

          default:
            break;
        }
      }
    }

    return this.userModel;
  }

}
