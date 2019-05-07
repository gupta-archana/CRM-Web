import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { DialogData } from '../../../Interfaces/DialogData';
import { ImageCroppedEvent } from 'ngx-image-cropper';
@Component({
  selector: 'app-change-profile-dialog',
  templateUrl: './change-profile-dialog.component.html',
  styleUrls: ['./change-profile-dialog.component.css']
})
export class ChangeProfileDialogComponent implements OnInit {

  croppedImage: any = "../../../../images/placeholder.png";
  imageChangedEvent: any = '';
  constructor(public dialogRef: MatDialogRef<ChangeProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
  }
  onChangeClick() {
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
    this.croppedImage = event.base64;
    console.log(JSON.stringify(event.base64.length * 0.001) + " KB");

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
}
