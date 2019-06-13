import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseClass } from '../../../../global/base-class';
import { Subscription } from 'rxjs';
import { NotesModel } from '../../../../models/notes-model';
import { ApiResponseCallback } from '../../../../Interfaces/ApiResponseCallback';

@Component({
  selector: 'app-all-notes',
  templateUrl: './all-notes.component.html',
  styleUrls: ['./all-notes.component.css']
})
export class AllNotesComponent extends BaseClass implements OnInit, OnDestroy, ApiResponseCallback {
  constructor(injector: Injector) {
    super(injector);
  }

  private MY_NOTES: string = "My Notes";
  pageNumber: number = 0;
  totalRows: any = 0;
  moreDataAvailable: boolean = false;
  totalAndCurrentRowsRatio: string = "";
  ALL: string = "ALL";
  uid: string;
  tabIndexSubscription: Subscription;
  newNoteAddedSubscription: Subscription;
  agentNotes: Array<NotesModel> = new Array<NotesModel>();
  selectedIndex: number = 0;
  ngOnInit() {
    this.uid = this.commonFunctions.getLoginCredentials().email;
    tabSelectedIndexSubscription(this);
    onNewNoteAdded(this);
  }

  getNotesType(item: NotesModel) {
    if (item.UID == this.uid) {
      return this.MY_NOTES
    }
    else {
      return item.entityID;
    }
  }
  onLoadMoreClick() {
    makeServerRequest(this);
  }

  onSuccess(response: any) {
    let data: NotesModel[] = response.sysNote;
    data.forEach(element => {
      if (element.entity != "TotalNotes") {
        element.dateCreated = element.dateCreated.split(" ")[0];
        this.agentNotes.push(element);
      } else {
        this.totalRows = element.rowNum;
      }
    });
    this.renderUI();
  }
  onError(errorCode: number, errorMsg: string) {
    this.renderUI();
  }

  onDeleteClick(item: NotesModel, i: number) {
    let self = this;
    this.apiHandler.deleteNote(item.sysNoteID, {
      onSuccess(response: any) {
        self.agentNotes.splice(i, 1);
        self.totalRows = self.totalRows - 1;
        self.dataService.onTabSelected(0);
        self.dataService.onDataUpdated();
        self.renderUI();
      }, onError(errorCode: number, errorMsg: string) {

      }
    })
  }

  public renderUI() {
    updateRatioUI(this);
    checkMoreDataAvailable(this);
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    if (this.tabIndexSubscription && !this.tabIndexSubscription.closed)
      this.tabIndexSubscription.unsubscribe();
    if (this.newNoteAddedSubscription && !this.newNoteAddedSubscription.closed)
      this.newNoteAddedSubscription.unsubscribe();
  }
}

function tabSelectedIndexSubscription(context: AllNotesComponent) {
  context.tabIndexSubscription = context.dataService.tabSelectedObservable.subscribe((index: number) => {
    context.selectedIndex = index;
    if (index == 0 && context.agentNotes.length <= 0) {
      makeServerRequest(context);
    }
  });
}
function makeServerRequest(context: AllNotesComponent) {
  context.pageNumber++;
  context.apiHandler.getNotes(context.ALL, context.ALL, context.ALL, context.pageNumber, context);
}

function updateRatioUI(context: AllNotesComponent) {
  context.totalAndCurrentRowsRatio = context.commonFunctions.showMoreDataSnackbar(context.agentNotes, context.totalRows);
  context.cdr.markForCheck();
}

function checkMoreDataAvailable(context: AllNotesComponent) {
  if ((!context.agentNotes && context.agentNotes.length == 0) || context.agentNotes.length >= context.totalRows)
    context.moreDataAvailable = false;
  else
    context.moreDataAvailable = true;
}

function onNewNoteAdded(context: AllNotesComponent) {
  context.newNoteAddedSubscription = context.dataService.dataUpdatedObservable.subscribe(data => {
    resetFields(context);
    if (context.selectedIndex == 0) {
      makeServerRequest(context);
    }
  });
}

function resetFields(context: AllNotesComponent) {
  context.agentNotes = [];
  context.pageNumber = 0;
  context.totalRows = 0;
  context.moreDataAvailable = false;
  context.totalAndCurrentRowsRatio = "";
}
