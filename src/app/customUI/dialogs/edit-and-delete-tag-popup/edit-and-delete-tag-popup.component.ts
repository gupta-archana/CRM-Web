import { Component, OnInit, Inject, OnDestroy, Injector } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '../../../Interfaces/DialogData';
import { TagModel } from '../../../models/tag-model';
import { ApiHandlerService } from '../../../utils/api-handler.service';

@Component({
  selector: 'app-edit-and-delete-tag-popup',
  templateUrl: './edit-and-delete-tag-popup.component.html',
  styleUrls: ['./edit-and-delete-tag-popup.component.css']
})
export class EditAndDeleteTagPopupComponent  implements OnInit {

  tagModel:TagModel;
  constructor(public dialogRef: MatDialogRef<EditAndDeleteTagPopupComponent>, private injector: Injector,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,public apiHandler: ApiHandlerService) {}

  ngOnInit() {
    this.tagModel = JSON.parse(this.data.message);
  }

  onCancelClick() {
    this.dialogRef.close(false);
  }

  onSuccess(response: any) {
    this.dialogRef.close(response);
  }
  onError(errorCode: number, errorMsg: string) {
    this.dialogRef.close(false);
  }
  onSaveChangesClick() {
    console.log(this.tagModel)
    this.apiHandler.updateTag(createRequestJson(this),this);
  }
  
  deleteTag()
  {
    this.apiHandler.deleteTag(this.tagModel.tagID,this);
  }
}
function createRequestJson(context: EditAndDeleteTagPopupComponent) {
  let finalJson = {
    "tag": "",
    "attr": context.tagModel
  }
  return finalJson;
}