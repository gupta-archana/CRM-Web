import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseClass } from '../../../../global/base-class';
import { NotesModel } from '../../../../models/notes-model';

@Component({
  selector: 'app-my-notes',
  templateUrl: './my-notes.component.html',
  styleUrls: ['./my-notes.component.css']
})
export class MyNotesComponent extends BaseClass implements OnInit, OnDestroy {

  constructor(injector: Injector) {
    super(injector);
  }

  notesSubscription: Subscription;
  agentNotes: Array<NotesModel> = new Array<NotesModel>();
  ngOnInit() {
    getNotesFromParent(this);
  }

  ngOnDestroy(): void {
    if (this.notesSubscription && !this.notesSubscription.closed)
      this.notesSubscription.unsubscribe();
  }
}
function getNotesFromParent(context: MyNotesComponent) {

  context.notesSubscription = context.dataService.shareDataObservable.subscribe(data => {
    if (data) {
      getMyNotesFromAllNotes(context, data);
      context.cdr.markForCheck();
    }
  })
}

function getMyNotesFromAllNotes(context: MyNotesComponent, allNotes: Array<NotesModel>) {
  context.agentNotes = [];
  let uid = context.commonFunctions.getLoginCredentials().email;
  allNotes.forEach(element => {
    if (element.UID == uid) {
      context.agentNotes.push(element);
    }
  });
  context.cdr.markForCheck();
}
