import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserProfileModel } from '../../../models/user-profile-model';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { BaseClass } from '../../../global/base-class';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-update-user-profile',
  templateUrl: './update-user-profile.component.html',
  styleUrls: ['./update-user-profile.component.css']
})
export class UpdateUserProfileComponent extends BaseClass implements OnInit, OnDestroy, ApiResponseCallback {

  constructor(injector: Injector) {
    super(injector);
  }
  userInfoForm: FormGroup;
  userProfileSubscription: Subscription = null;
  userProfileModel: UserProfileModel = null;
  numberTypeArray: Array<string> = ["Home", "Mobile", "Work", "Fax"];
  states: Array<string> = ["Nevada", "AL"];
  selectedNumberOneType: string = "";
  selectedNumberTwoType: string = "";

  ngOnInit() {
    this.selectedNumberOneType = this.numberTypeArray[2];
    this.selectedNumberTwoType = this.numberTypeArray[3];
    getUserProfile(this);
    addValidation(this);
  }

  onNumberOneTypeChange(event) {
    this.selectedNumberOneType = this.numberTypeArray.find(n => n == event.target.value);
    this.userInfoForm.get("phoneType").setValue(this.selectedNumberOneType);
  }
  onNumberTwoTypeChange(event) {
    this.selectedNumberTwoType = this.numberTypeArray.find(n => n == event.target.value);
    this.userInfoForm.get("phoneType2").setValue(this.selectedNumberTwoType);
  }
  onStateChanged(event) {
    this.userInfoForm.get("state").setValue(this.states.find(n => n == event.target.value));
  }
  onSaveChangeClick() {
    if (!this.userInfoForm.valid) {
      this.getFormValidationErrors();
    }
    else {

    }
    //this.commonFunctions.printLog(this.selectedNumberOneType + "," + this.selectedNumberTwoType);
  }




  onSuccess(response: any) {

  }
  onError(errorCode: number, errorMsg: string) {

  }


  getFormValidationErrors() {
    Object.keys(this.userInfoForm.controls).forEach(key => {

      const controlErrors: ValidationErrors = this.userInfoForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
  }


  ngOnDestroy(): void {
    if (this.userProfileSubscription && !this.userProfileSubscription.closed) {
      this.userProfileSubscription.unsubscribe();
    }
  }

}
function getUserProfile(context: UpdateUserProfileComponent) {
  context.userProfileSubscription = context.dataService.shareUserProfileObservable.subscribe(data => {
    context.userProfileModel = data;
  })

}

function addValidation(context: UpdateUserProfileComponent) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  context.userInfoForm = new FormGroup({
    name: new FormControl("", Validators.compose([Validators.required, Validators.minLength(2)])),
    jobTitle: new FormControl("", Validators.compose([Validators.required, Validators.minLength(2)])),
    address1: new FormControl("", Validators.compose([Validators.required, Validators.minLength(2)])),
    phone: new FormControl("", Validators.compose([Validators.required, Validators.minLength(2)])),
    phone2: new FormControl("", Validators.compose([Validators.required, Validators.minLength(2)])),
    phoneType: new FormControl(context.numberTypeArray[2], Validators.compose([Validators.required, Validators.minLength(2)])),
    phone2Type: new FormControl(context.numberTypeArray[3], Validators.compose([Validators.required, Validators.minLength(2)])),
    state: new FormControl(context.states[0], Validators.compose([Validators.required, Validators.minLength(2)])),
    email: new FormControl("", Validators.compose([Validators.required, Validators.pattern(re)])),
  })
}

