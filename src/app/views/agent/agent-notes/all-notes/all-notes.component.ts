import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseClass } from '../../../../global/base-class';
import { Subscription } from 'rxjs';
import { NotesModel } from '../../../../models/notes-model';

@Component({
  selector: 'app-all-notes',
  templateUrl: './all-notes.component.html',
  styleUrls: ['./all-notes.component.css']
})
export class AllNotesComponent extends BaseClass implements OnInit, OnDestroy {

  constructor(injector: Injector) {
    super(injector);
  }

  private MY_NOTES: string = "My Notes";

  uid: string;
  notesSubscription: Subscription;
  agentNotes: Array<NotesModel> = new Array<NotesModel>();
  ngOnInit() {
    this.uid = this.commonFunctions.getLoginCredentials().email;
    getNotesFromParent(this);
  }

  getNotesType(item: NotesModel) {
    if (item.UID == this.uid) {
      return this.MY_NOTES
    }
    else {
      return item.entityID;
    }
  }

  ngOnDestroy(): void {
    if (this.notesSubscription && !this.notesSubscription.closed)
      this.notesSubscription.unsubscribe();
  }
}
function getNotesFromParent(context: AllNotesComponent) {

  context.notesSubscription = context.dataService.shareDataObservable.subscribe(data => {
    if (data) {
      context.agentNotes = data;
      context.cdr.markForCheck();
    }
  })
}
