import { Component, OnInit, Injector, ViewChild, ElementRef } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { PatternValidator } from '@angular/forms';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent extends BaseClass implements OnInit, ApiResponseCallback {

  constructor(private injector: Injector) { super(injector) }

  @ViewChild("cancel")
  cancel: ElementRef;
  currentPassword: string = "";
  capitalLetterValidation: boolean = false;
  oneDigitValidation: boolean = false;
  min8CharacterValidation: boolean = false;
  oneSpecialCharacterValidation: boolean = false;

  oldPassword: string = "";
  newPassword: string = "";
  rePassword: string = "";

  errorMsg: string = "";

  ngOnInit() {
    this.currentPassword = this.myLocalStorage.getValue(this.constants.PASSWORD);
  }
  onNewPasswordChanged(password: string) {
    this.commonFunctions.printLog(this.newPassword)
    validatingPassword(this)
  }

  onSubmit() {
    //this.onSuccess("");
    this.errorMsg = "";
    if (!this.oldPassword)
      this.errorMsg = "Old password can not left blank";
    else if (this.oldPassword != this.currentPassword)
      this.errorMsg = "Old password does not match current password";
    else if (!this.capitalLetterValidation || !this.oneDigitValidation || !this.min8CharacterValidation || !this.oneSpecialCharacterValidation)
      this.errorMsg = "Entered password does not match password policy";
    else if (this.rePassword != this.newPassword)
      this.errorMsg = "Paswword mismatch";

    if (!this.errorMsg) {
      this.apiHandler.changePassword(this.commonFunctions.getEncryptedPassword(this.newPassword), this);
    }
  }
  onSuccess(response: any) {
    this.myLocalStorage.setValue(this.constants.PASSWORD, this.newPassword);
    this.commonFunctions.showSnackbar(response)
    this.cancel.nativeElement.click();
  }
  onError(errorCode: number, errorMsg: string) {
    this.commonFunctions.showErrorSnackbar(errorMsg)
  }

}


function validatingPassword(context: ChangePasswordComponent) {

  if (context.newPassword.match(".*[A-Z].*")) {
    context.capitalLetterValidation = true;
  } else {
    context.capitalLetterValidation = false;
  }

  if (context.newPassword.match(".*[$@$!%*?&].*")) {
    context.oneSpecialCharacterValidation = true;
  } else {
    context.oneSpecialCharacterValidation = false;
  }

  if (context.newPassword.match(".*\\d.*")) {
    context.oneDigitValidation = true;
  } else {
    context.oneDigitValidation = false;
  }

  if (context.newPassword.length >= 8 && context.newPassword.length < 20) {
    context.min8CharacterValidation = true;
  } else {
    context.min8CharacterValidation = false;
  }

}
