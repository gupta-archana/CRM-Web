import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { DialogData } from '../../../Interfaces/DialogData';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-change-profile-dialog',
  templateUrl: './change-profile-dialog.component.html',
  styleUrls: ['./change-profile-dialog.component.css']
})
export class ChangeProfileDialogComponent implements OnInit {

  croppedImage: any = "../../../../images/placeholder.png";
  croppedImageFile: Blob = null;
  imageChangedEvent: any = '';
  uploadedImage: Blob;
  constructor(public dialogRef: MatDialogRef<ChangeProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private ngImgMax: Ng2ImgMaxService,
    public domSanitizer: DomSanitizer) { }

  ngOnInit() {
  }
  onChangeClick() {
    let file: File = this.blobToFile(this.croppedImageFile, "user.png");
    this.ngImgMax.compressImage(file, 0.025, true, true).subscribe(
      result => {
        this.uploadedImage = result;
        this.blobToBase64(this.uploadedImage).asObservable().subscribe(base64String => {
          this.croppedImage = this.domSanitizer.bypassSecurityTrustResourceUrl(JSON.parse(base64String));
        });

        console.log(JSON.stringify(this.uploadedImage.size * 0.001) + " KB");
      },
      error => {
        console.log('😢 Oh no!', error);
      }
    );

    this.imageChangedEvent = null;
    //this.dialogRef.close();
  }
  onDeleteClick() {
    this.dialogRef.close();
  }
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImageFile = event.file;
    this.croppedImage = event.base64;
    //this.ngImgMax.compressImage()



  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
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
}

