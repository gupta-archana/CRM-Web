import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataServiceService } from '../../services/data-service.service';
import { CommonFunctionsService } from '../../utils/common-functions.service';
import { Constants } from '../../Constants/Constants';
import { ApiResponseCallback } from '../../Interfaces/ApiResponseCallback';
import { ApiHandlerService } from '../../utils/api-handler.service';
import { MatDialog } from '@angular/material';
import { AlertDialogComponent } from '../../customUI/dialogs/alert-dialog/alert-dialog.component';
import { ForgotPasswordAlertComponent } from '../../customUI/dialogs/forgot-password/forgot-password-alert.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit, ApiResponseCallback {

  forgotPasswordForm: FormGroup;
  constructor(private dataService: DataServiceService,
    private commonFunctions: CommonFunctionsService,
    private constants: Constants,
    private apiHandler: ApiHandlerService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.addValidation();
  }


  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.dataService.onHideShowLoader(true);
      this.apiHandler.forgotPassword(this.forgotPasswordForm.value.email, this);
    } else {
      this.commonFunctions.showErrorSnackbar(this.constants.ERROR_INVALID_EMAIL);

    }
  }


  onSuccess(response: any) {
    this.dataService.onHideShowLoader(false);
    let responseBody = response.Envelope.Body;
    if (responseBody.hasOwnProperty('Fault')) {
      let errorCode = responseBody.Fault.code;
      let msg = responseBody.Fault.message;
      this.onError(errorCode, msg);
    }
    else {
      let successMsg = responseBody.Success.message;
      const dialogRef = this.dialog.open(ForgotPasswordAlertComponent);
      dialogRef.afterClosed().subscribe(closed => {
        this.commonFunctions.backPress();
        this.commonFunctions.backPress();
      });
    }


  }
  onError(errorCode: number, errorMsg: string) {
    this.dataService.onHideShowLoader(false);
    this.commonFunctions.showErrorSnackbar(errorMsg);
  }

  private addValidation() {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', Validators.compose([Validators.required, Validators.pattern(re)])),
    });
  }
}
