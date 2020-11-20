import { Component, OnInit, Injector, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { BaseClass } from 'src/app/global/base-class';
import { ApiResponseCallback } from 'src/app/Interfaces/ApiResponseCallback';
import { EntityModel } from 'src/app/models/entity-model';
import { Subscription } from 'rxjs';
import { NotesModel } from 'src/app/models/notes-model';
import { data } from 'jquery';

@Component({
  selector: 'app-update-note',
  templateUrl: './update-note.component.html',
  styleUrls: ['./update-note.component.css']
})
export class UpdateNoteComponent extends BaseClass implements OnInit, ApiResponseCallback, OnDestroy {

  constructor(private injector: Injector) {
    super(injector);
  }
  @ViewChild("closeUpdateNote")
  closeUpdateNote: ElementRef;
  note: string = "";
  noteModel: NotesModel = new NotesModel();
  noteModelSubscription: Subscription = null;
  notesCategory:any
  summary : string = "";
  entityInfo: EntityModel;
  category = [
    { id : 1,value: "General"},
    { id : 2,value: "Events"},
    { id : 3,value: "Opportunities"},
    { id : 4,value: "Issues"},
  ]
  seq:any
  ngOnInit() {
    getEntityTypeAndId(this);
    getNoteModel(this);

  }

  onSaveClick() {
    if (this.note && this.note.length > 0) {
      this.apiHandler.updateNote(getRequest(this), this);
    }
  }


  onSuccess(response: any) {
    this.cdr.markForCheck()
    this.commonFunctions.showSnackbar(response);
    //this.dataService.onShareUpdatedNote(this.note);
    this.dataService.onDataUpdated();
    this.closeUpdateNote.nativeElement.click();
  }
  onError(errorCode: number, errorMsg: string) {
    this.commonFunctions.showErrorSnackbar(errorMsg);
  }

  ngOnDestroy(): void {
    if (this.noteModelSubscription && !this.noteModelSubscription.closed) {
      this.noteModelSubscription.unsubscribe();
    }
  }
}

function getEntityTypeAndId(context: UpdateNoteComponent) {
  context.entityInfo = JSON.parse(sessionStorage.getItem(context.constants.ENTITY_INFO));;
}
function getNoteModel(context: UpdateNoteComponent) {
  context.noteModelSubscription = context.dataService.shareDataObservable.subscribe((data: NotesModel) => {
    context.noteModel = data;
    context.seq = data.seq
    
    // if(context.noteModel.category ==='General')
    // context.notesCategory= 1
    // else if(context.noteModel .category ==='Events')
    // context.notesCategory= 2
    // else if(context.noteModel .category ==='Opportunities')
    // context.notesCategory = 3
    // else if(context.noteModel .category ==='Issues')
    // context.notesCategory = 4
   
    context.notesCategory = context.noteModel.category
    context.note = context.noteModel.notes;
    context.summary = context.noteModel.subject
    // context.notesCategory = context.noteModel.category
    context.cdr.markForCheck();
  });
}

function getRequest(context: UpdateNoteComponent) {

if(context.entityInfo.type=="A")
{
  let requestJson = {
    "UID": context.commonFunctions.getLoginCredentials().email,
    "agentID": context.noteModel.agentID,
    "notes": context.note,
    "subject": context.summary,
    "seq" : context.seq,
    "category": context.notesCategory,
    "entity": context.entityInfo.type,
  }
  let finalJson = {
    "SysNote": "",
    "attr": requestJson
  }
  return finalJson;

}
 if(context.entityInfo.type=="P")
 {
  let requestJson = {
    "uid": context.commonFunctions.getLoginCredentials().email,
    "entity": context.entityInfo.type,
    "entityID": context.entityInfo.entityId,
    "notes": context.note,
    "subject": context.summary,
    "seq" : context.seq,
    "category": context.notesCategory,
    "sysNoteID": context.noteModel.sysNoteID
  }
  let finalJson = {
    "SysNote": "",
    "attr": requestJson
  }
  return finalJson;
 }
}

