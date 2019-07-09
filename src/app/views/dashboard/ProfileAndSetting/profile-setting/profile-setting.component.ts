import { Component, OnInit, Injector, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { BaseClass } from '../../../../global/base-class';
import { ApiResponseCallback } from '../../../../Interfaces/ApiResponseCallback';
import { UserProfileModel } from '../../../../models/user-profile-model';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-setting',
  templateUrl: './profile-setting.component.html',
  styleUrls: ['./profile-setting.component.css']
})
export class ProfileSettingComponent extends BaseClass implements OnInit, ApiResponseCallback, OnDestroy {


  userProfileModel: UserProfileModel = new UserProfileModel();
  userImg: any = "";
  dataUpdatedSubscription: Subscription = null;

  constructor(private injector: Injector, public domSanitizer: DomSanitizer) { super(injector); }

  ngOnInit() {
    getUserProfileData(this);
    registerDataUpdatedObservable(this);
  }
  onEditProfilePicClick() {
    this.dataService.shareUserProfile(this.userProfileModel);
    const dialogRef = this.openDialogService.showChangePicDialog();
    dialogRef.afterClosed().subscribe(callback => {
      if (callback) {
        getUserProfileData(this);
      }
    });
  }

  onEditProfileClick() {
    this.dataService.shareUserProfile(this.userProfileModel);
    //this.dataService.onAgentProfileEditClick(true);
  }

  shareVCard() {
    let userInfo = {
      "type": this.constants.ENTITY_EMPLOYEE_PRESENTER,
      "id": this.userProfileModel.uid
    }
    this.dataService.onShareEntityIdAndType(userInfo);
  }

  onSuccess(response: any) {
    this.userProfileModel = response.UserProfile[0];
    this.commonFunctions.printLog(this.userProfileModel.name);
    this.userProfileModel.shareable = response.UserProfile[0].shareable == "yes";
    this.userImg = this.domSanitizer.bypassSecurityTrustResourceUrl(this.userProfileModel.picture);
    this.cdr.markForCheck();
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

  ngOnDestroy(): void {
    if (this.dataUpdatedSubscription && !this.dataUpdatedSubscription.closed)
      this.dataUpdatedSubscription.unsubscribe();
  }
}

function registerDataUpdatedObservable(context: ProfileSettingComponent) {
  context.dataUpdatedSubscription = context.dataService.dataUpdatedObservable.subscribe(isUpdated => {
    if (isUpdated) {
      getUserProfileData(context);
    }
  });
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
      context.commonFunctions.showSnackbar(response);
    },
    onError(errorCode: number, errorMsg: string) {
      context.commonFunctions.showErrorSnackbar(errorMsg);
    }
  })
}
