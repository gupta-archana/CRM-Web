import { Component, OnInit, Injector, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseClass } from '../../../global/base-class';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { UtilService } from '../../../utils/util.service';
import { EntityModel } from '../../../models/entity-model';

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.css']
})
export class AddNoteComponent extends BaseClass implements OnInit, ApiResponseCallback {
  constructor(private injector: Injector) {
    super(injector);
  }
  @ViewChild("closeAddNote")
  closeAddNote: ElementRef;
  note: string = "";
  entityInfo: EntityModel;
  shareEntityIdAndTypeSubscription: Subscription = null;

  ngOnInit() {
    getEntityTypeAndId(this);

  }

  onSaveClick() {
    if (this.note) {
      this.apiHandler.createNote(getRequest(this), this);

      //getRequest(this);
    }
  }


  onSuccess(response: any) {
    this.note = "";
    this.cdr.markForCheck()
    this.commonFunctions.showSnackbar(response);
    this.dataService.onDataUpdated();
    this.closeAddNote.nativeElement.click();
  }
  onError(errorCode: number, errorMsg: string) {

    this.commonFunctions.showErrorSnackbar(errorMsg);
  }
}
function getEntityTypeAndId(context: AddNoteComponent) {
  context.entityInfo = JSON.parse(sessionStorage.getItem(context.constants.ENTITY_INFO));;
}

function getRequest(context: AddNoteComponent) {

  let requestJson = {
    "UID": context.commonFunctions.getLoginCredentials().email,
    "entity": context.entityInfo.type,
    "entityID": context.entityInfo.entityId,
    "notes": context.note
  }

  let finalJson = {
    "SysNote": "",
    "attr": requestJson
  }
  return finalJson;
}
