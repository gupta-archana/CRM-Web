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
import { CommonApisService } from '../../utils/common-apis.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, ApiResponseCallback, CanComponentDeactivate {

    loginForm: FormGroup;
    tooltipText = "Show Password";
    username = "";
    password = "";
    isChecked = false;
    show: boolean;
    showButton: boolean;
    constructor(
        private commonFunctions: CommonFunctionsService,
        private authservice: AuthService,
        private apiHandler: ApiHandlerService,
        private dataService: DataServiceService,
        private loginParser: LoginParserService,
        private myLocalStorage: MyLocalStorageService,
        private constants: Constants,
        private router: Router,
        private commonApis: CommonApisService,
        private routingState: RoutingStateService) {

        this.show = false;
        this.showButton = false;

    }

    ngOnInit() {
        if (this.myLocalStorage.getValue(this.constants.LOGGED_IN)) {
            const currentPath = localStorage.getItem("selected_home_screen") ? localStorage.getItem("selected_home_screen") : path.PATH_SEARCH;
            this.commonFunctions.navigateWithReplaceUrl(currentPath);

        } else {
            this.addValidation();
        }

    }

    showHidePasswordButton() {
        if (this.loginForm.get('password').dirty) {
            this.showButton = true;
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
        if(!this.myLocalStorage.getValue(this.constants.SERVER_URL)) { 
            this.commonFunctions.showErrorSnackbar('Please Configure the Server URL')
            return;
        }        
        this.commonFunctions.printLog(this.loginForm.value.email, true);
        if (!this.loginForm.valid) {
            this.commonFunctions.showErrorSnackbar("Invalid Credentials");
        } else {
            this.dataService.onHideShowLoader(true);
            this.apiHandler.performLogin(this.loginForm.value.email, this.commonFunctions.getEncryptedPassword(this.loginForm.value.password), this);
        }

    }

    showHidePassword(showPassword: boolean) {
        if (showPassword) {
            this.show = true;
            this.tooltipText = "Show Password";
        } else {
            this.show = false;
        }

    }

    onSuccess(response: any) {
        this.dataService.onHideShowLoader(false);
        const userModel: UserModel = this.loginParser.parseLogin(response.parameter);
        this.authservice.onLoginSuccess(userModel.currentUserEmail, this.loginForm.value.password, this.loginForm.value.isChecked);
        this.commonApis.getAppConfig().subscribe(success => {
            if (success === 1) {
                this.authservice.navigateToNextAfterLogin();
                this.commonFunctions.showSnackbar(this.constants.LOGIN_SUCCESS);

            }
        });





    }

    onError(errorCode: number, errorMsg: string) {
        this.dataService.onHideShowLoader(false);
        this.commonFunctions.showErrorSnackbar(errorMsg);

    }

    private addValidation() {
        this.isChecked = this.myLocalStorage.getValue(this.constants.REMEMBER_ME) === "1" ? true : false;
        if (this.isChecked) {
            this.username = this.myLocalStorage.getValue(this.constants.EMAIL);
            this.password = this.myLocalStorage.getValue(this.constants.PASSWORD);
        }

        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.loginForm = new FormGroup({
            email: new FormControl(this.username, Validators.compose([Validators.required, Validators.pattern(re)])),
            password: new FormControl(this.password, Validators.compose([Validators.required, Validators.minLength(6)])),
            isChecked: new FormControl(this.isChecked)
        });
    }
}
