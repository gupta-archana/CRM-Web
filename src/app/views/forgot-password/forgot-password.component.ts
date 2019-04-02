import { Component, OnInit, Injector } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataServiceService } from '../../services/data-service.service';
import { CommonFunctionsService } from '../../utils/common-functions.service';
import { Constants } from '../../Constants/Constants';
import { ApiResponseCallback } from '../../Interfaces/ApiResponseCallback';
import { ApiHandlerService } from '../../utils/api-handler.service';
import { MatDialog } from '@angular/material';
import { AlertDialogComponent } from '../../customUI/dialogs/alert-dialog/alert-dialog.component';
import { ForgotPasswordAlertComponent } from '../../customUI/dialogs/forgot-password/forgot-password-alert.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogComponent } from '../../customUI/dialogs/confirmation-dialog/confirmation-dialog.component';
import { BaseClass } from '../../global/base-class';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent extends BaseClass implements OnInit, ApiResponseCallback {

  forgotPasswordForm: FormGroup;
  constructor(private injector: Injector) {
    super(injector);
  }

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

      const modalRef = this.openDialogService.showAlertDialog(this.constants.PASSWORD_SENT, this.constants.PASSWORD_SENT_ALERT_MSG);
      modalRef.afterClosed().subscribe(closed => {
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
