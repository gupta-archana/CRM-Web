import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from 'src/app/Interfaces/DialogData';
import { ApiHandlerService } from 'src/app/utils/api-handler.service';
import { Constants } from 'src/app/Constants/Constants';
import { ApiResponseCallback } from 'src/app/Interfaces/ApiResponseCallback';
import { EntityModel } from 'src/app/models/entity-model';

@Component({
  selector: 'app-add-new-event',
  templateUrl: './add-new-event.component.html',
  styleUrls: ['./add-new-event.component.css']
})
export class AddNewEventComponent implements OnInit, ApiResponseCallback {


  constructor(public dialogRef: MatDialogRef<AddNewEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private apiHandler: ApiHandlerService, private constant: Constants) { }

  keyword: string = "";
  persons: EntityModel[] = [];
  public TOTAL_MATCH: string = "TotalMatch";
  ngOnInit() {
  }

  selectEvent(event) {

  }
  onChangeSearch(event: string) {
    if (event.length > 2) {
      this.apiHandler.GetSearchedData(this.constant.ENTITY_PERSON_PRESENTER, "ALL", event, 1, this);
    }
    console.log(event);
  }

  onSuccess(response: any) {
    onApiResponse(this, response.profile);
  }
  onError(errorCode: number, errorMsg: string) {
    
  }



  onSaveChangesClick() {
    this.dialogRef.close(true);
  }
  onCancelClick() {
    this.dialogRef.close(false);
  }
}

function onApiResponse(context: AddNewEventComponent, newUsers: EntityModel[]) {
  if (newUsers && newUsers.length > 0) {
    newUsers.forEach(element => {
      if (element.type != context.TOTAL_MATCH) {
        context.persons.push(element);
      }
    });
  }
}