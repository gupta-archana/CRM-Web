import { Component, Injector, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { DialogData } from '../../../Interfaces/DialogData';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { Subject, Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { BaseClass } from '../../../global/base-class';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { CommonFunctionsService } from '../../../utils/common-functions.service';
import { ApiHandlerService } from '../../../utils/api-handler.service';
import { DataServiceService } from '../../../services/data-service.service';
@Component({
  selector: 'app-change-profile-dialog',
  templateUrl: './change-profile-dialog.component.html',
  styleUrls: ['./change-profile-dialog.component.css']
})
export class ChangeProfileDialogComponent implements OnInit, ApiResponseCallback {


  croppedImage: any = "../../../../images/placeholder.png";
  croppedImageFile: Blob = null;
  imageChangedEvent: any = '';
  uploadImageBase64String: any = "";
  uploadedImage: Blob;
  public userProfileSub: Subscription;

  constructor(public dialogRef: MatDialogRef<ChangeProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private ngImgMax: Ng2ImgMaxService,
    public domSanitizer: DomSanitizer,
    public commonFunctions: CommonFunctionsService,
    public apiHandler: ApiHandlerService,
    public dataService: DataServiceService
  ) {

  }

  ngOnInit() {
    userProfileSubscription(this);
  }
  onChangeClick() {
    let file: File = this.blobToFile(this.croppedImageFile, "user.png");
    this.compressImage(file);
    this.imageChangedEvent = null;

  }

  private compressImage(file: File) {
    this.ngImgMax.compressImage(file, 0.010, true, true).subscribe(result => {
      this.uploadedImage = result;
      this.blobToBase64Img();
      console.log(JSON.stringify(this.uploadedImage.size * 0.001) + " KB");
    }, error => {
      console.log('😢 Oh no!', error);
    });
  }

  private blobToBase64Img() {
    this.blobToBase64(this.uploadedImage).asObservable().subscribe(base64String => {
      this.uploadImageBase64String = base64String;
      this.croppedImage = this.domSanitizer.bypassSecurityTrustResourceUrl(JSON.parse(base64String));
      uploadPicToServer(this);
    });
  }

  onSuccess(response: any) {
    this.commonFunctions.showSnackbar(response);
    this.dialogRef.close(true);
  }
  onError(errorCode: number, errorMsg: string) {
    this.commonFunctions.showSnackbar(errorMsg);
    this.dialogRef.close(false);
  }

  onDeleteClick() {
    this.uploadImageBase64String = "";
    uploadPicToServer(this);
    this.dialogRef.close();
  }
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImageFile = event.file;
    this.croppedImage = event.base64;

  }

  blobToFile = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    //Cast to a File() type
    return <File>theBlob;
  }

  blobToBase64 = (blob: Blob): Subject<string> => {
    var subject: Subject<string> = new Subject<string>();
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = function() {
      subject.next(JSON.stringify(reader.result));
    }
    return subject;
  }

  loadImageFailed() {
    this.commonFunctions.showErrorSnackbar("There is some issue in image load");
  }
}
function userProfileSubscription(context: ChangeProfileDialogComponent) {
  context.userProfileSub = context.dataService.shareUserProfileObservable.subscribe(data => {
    if (data.picture) {
      context.croppedImage = context.domSanitizer.bypassSecurityTrustResourceUrl(data.picture);
    }
  });
}
function uploadPicToServer(context: ChangeProfileDialogComponent) {
  context.apiHandler.updateUserProfilePic(createRequestJson(context), context);
}

function createRequestJson(context: ChangeProfileDialogComponent) {
  let requestJson = {
    "UID": context.commonFunctions.getLoginCredentials().email,
    "picture": JSON.parse(context.uploadImageBase64String)
  }

  let finalJson = {
    "userData": "",
    "attr": requestJson
  }
  return finalJson;
}

