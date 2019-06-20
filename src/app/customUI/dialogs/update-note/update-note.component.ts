import { Component, OnInit, Injector, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { BaseClass } from 'src/app/global/base-class';
import { ApiResponseCallback } from 'src/app/Interfaces/ApiResponseCallback';
import { EntityModel } from 'src/app/models/entity-model';
import { Subscription } from 'rxjs';
import { NotesModel } from 'src/app/models/notes-model';

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

  ngOnInit() {

    getNoteModel(this);

  }

  onSaveClick() {
    if (this.note && this.note.length > 0) {
      this.apiHandler.updateNote(getRequest(this), this);
    }
  }


  onSuccess(response: any) {
    this.commonFunctions.showSnackbar(response);
    this.dataService.onShareUpdatedNote(this.note);
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

function getNoteModel(context: UpdateNoteComponent) {
  context.noteModelSubscription = context.dataService.shareDataObservable.subscribe((data: NotesModel) => {
    context.noteModel = data;
    context.note = context.noteModel.notes;
    context.cdr.markForCheck();
  });
}

function getRequest(context: UpdateNoteComponent) {

  let requestJson = {
    "sysNoteID": context.noteModel.sysNoteID,
    "notes": context.note
  }

  let finalJson = {
    "SysNote": "",
    "attr": requestJson
  }
  return finalJson;
}

