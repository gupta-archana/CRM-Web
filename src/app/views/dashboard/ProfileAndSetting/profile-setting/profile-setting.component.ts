import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../../../global/base-class';
import { ApiResponseCallback } from '../../../../Interfaces/ApiResponseCallback';
import { UserProfileModel } from '../../../../models/user-profile-model';

@Component({
  selector: 'app-profile-setting',
  templateUrl: './profile-setting.component.html',
  styleUrls: ['./profile-setting.component.css']
})
export class ProfileSettingComponent extends BaseClass implements OnInit, ApiResponseCallback {
  private userProfileModel: UserProfileModel = new UserProfileModel();
  userImg: string = "";

  constructor(private injector: Injector) { super(injector); }

  ngOnInit() {
    getUserProfileData(this);
  }
  onEditProfilePicClick() {
    const dialogRef = this.openDialogService.showChangePicDialog();
    dialogRef.afterClosed().subscribe(callback => {

    });
  }

  onEditProfileClick() {
    this.dataService.onAgentProfileEditClick(true);
  }

  onSuccess(response: any) {
    this.userProfileModel = response.UserProfile[0];
    this.commonFunctions.printLog(this.userProfileModel.name);
    this.userProfileModel.shareable = response.UserProfile[0].shareable == "yes";
    this.userImg = "data:image/png;base64," + this.userProfileModel.picture;
    //getUserProfilePic(this)
  }
  onError(errorCode: number, errorMsg: string) {
    this.commonFunctions.showErrorSnackbar(errorMsg);
  }
  doCall(number: string) {
    this.commonFunctions.printLog(number);
  }

  onShareableStatusChange(event) {
    this.commonFunctions.printLog(event);
    let status = event ? "Yes" : "No";
    changeShareableStatus(this, status);

  }
}

function getUserProfileData(context: ProfileSettingComponent) {
  context.apiHandler.getUserProfile(context);

}

// function getUserProfilePic(context: ProfileSettingComponent) {
//   context.apiHandler.getUserPicture({
//     onSuccess(response: any) {
//       let base64Img = response.parameter[0].Picture;
//       if (base64Img)
//         context.userImg = "data:image/png;base64," + base64Img;
//       else {
//         context.userImg = "../../../../../images/placeholder.png";
//       }
//       context.commonFunctions.printLog(base64Img);
//       context.cdr.markForCheck();
//     },
//     onError(errorCode: number, errorMsg: string) {
//       context.commonFunctions.showErrorSnackbar(errorMsg);
//     }
//   });
// }

function changeShareableStatus(context: ProfileSettingComponent, status: string) {
  context.apiHandler.ChangeShareableStatus(status, {
    onSuccess(response: any) {
      context.dataService.onHideShowLoader(false);
      let responseBody = response.Envelope.Body;
      if (responseBody.hasOwnProperty('Fault')) {
        let errorCode = responseBody.Fault.code;
        let msg = responseBody.Fault.message;
        this.apiResponseCallback.onError(errorCode, msg);
      }
      else {
        let msg = responseBody.Success.message;
        context.commonFunctions.showSnackbar(msg);
      }
    },
    onError(errorCode: number, errorMsg: string) {
      context.commonFunctions.showErrorSnackbar(errorMsg);
    }
  })
}
