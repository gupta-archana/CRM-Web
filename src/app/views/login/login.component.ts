import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonFunctionsService } from '../../utils/common-functions.service';
import { ApiHandlerService } from '../../utils/api-handler.service';
import { DataServiceService } from '../../services/data-service.service';
import { ApiResponseCallback } from '../../Interfaces/ApiResponseCallback';
import { LoginParserService } from '../../parsers/login-parser.service';
import { UserModel } from '../../models/UserModel';
import { AuthService } from '../../services/auth.service';
import { MyLocalStorageService } from '../../services/my-local-storage.service';
import { Constants } from '../../Constants/Constants';
import { CanComponentDeactivate } from '../../guards/login-guard.guard';
import { Router } from '@angular/router';
import * as path from '../../Constants/paths';
import { RoutingStateService } from 'src/app/services/routing-state.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, ApiResponseCallback, CanComponentDeactivate {

  loginForm: FormGroup;
  username: string = "";
  password: string = "";
  isChecked: boolean = false;

  constructor(
    private commonFunctions: CommonFunctionsService,
    private authservice: AuthService,
    private apiHandler: ApiHandlerService,
    private dataService: DataServiceService,
    private loginParser: LoginParserService,
    private myLocalStorage: MyLocalStorageService,
    private constants: Constants,
    private router: Router,
    private routingState: RoutingStateService) {


  }

  ngOnInit() {
    if (this.myLocalStorage.getValue(this.constants.LOGGED_IN)) {
      let currentPath = localStorage.getItem("selected_home_screen") ? localStorage.getItem("selected_home_screen") : path.PATH_SEARCH;
      this.commonFunctions.navigateWithReplaceUrl(currentPath);
      
    } else {
      this.addValidation();
    }
  }

  checkValue(event) {
    this.commonFunctions.printLog(event, true);
  }
  canDeactivate() {
    if (this.myLocalStorage.getValue(this.constants.LOGGED_IN)) {
      return true;
    }
    return false;
  }

  onSubmit() {
    this.commonFunctions.printLog(this.loginForm.value.email, true);
    if (!this.loginForm.valid) {
      this.commonFunctions.showErrorSnackbar("Invalid Credentials");
    }
    else {
      this.dataService.onHideShowLoader(true);
      this.apiHandler.performLogin(this.loginForm.value.email, this.commonFunctions.getEncryptedPassword(this.loginForm.value.password), this);
    }

  }

  onSuccess(response: any) {
    this.dataService.onHideShowLoader(false);
    let userModel: UserModel = this.loginParser.parseLogin(response.parameter);
    this.commonFunctions.showSnackbar("Successfully logged in " + userModel.currentUserName);
    this.authservice.onLoginSuccess(userModel.currentUserEmail, this.loginForm.value.password, this.loginForm.value.isChecked);

  }

  onError(errorCode: number, errorMsg: string) {
    this.dataService.onHideShowLoader(false);
    this.commonFunctions.showErrorSnackbar(errorMsg);

  }

  private addValidation() {
    this.isChecked = this.myLocalStorage.getValue(this.constants.REMEMBER_ME) == "1" ? true : false;
    if (this.isChecked) {
      this.username = this.myLocalStorage.getValue(this.constants.EMAIL);
      this.password = this.myLocalStorage.getValue(this.constants.PASSWORD);
    }

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.loginForm = new FormGroup({
      email: new FormControl(this.username, Validators.compose([Validators.required, Validators.pattern(re)])),
      password: new FormControl(this.password, Validators.compose([Validators.required, Validators.minLength(6)])),
      isChecked: new FormControl(this.isChecked)
    });
  }
}
