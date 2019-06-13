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
        self.dataService.onTabSelected(1);
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

function tabSelectedIndexSubscription(context: MyNotesComponent) {
  context.tabIndexSubscription = context.dataService.tabSelectedObservable.subscribe((index: number) => {
    context.selectedIndex = index;
    if (index == 1 && context.agentNotes.length <= 0) {
      makeServerRequest(context);
    }
  });
}
function makeServerRequest(context: MyNotesComponent) {
  context.pageNumber++;
  context.apiHandler.getNotes(context.uid, context.ALL, context.ALL, context.pageNumber, context);
}

function updateRatioUI(context: MyNotesComponent) {
  context.totalAndCurrentRowsRatio = context.commonFunctions.showMoreDataSnackbar(context.agentNotes, context.totalRows);
  context.cdr.markForCheck();
}

function checkMoreDataAvailable(context: MyNotesComponent) {
  if ((!context.agentNotes && context.agentNotes.length == 0) || context.agentNotes.length >= context.totalRows)
    context.moreDataAvailable = false;
  else
    context.moreDataAvailable = true;
}
function onNewNoteAdded(context: MyNotesComponent) {
  context.newNoteAddedSubscription = context.dataService.dataUpdatedObservable.subscribe(data => {
    resetFields(context);
    if (context.selectedIndex == 1) {
      makeServerRequest(context);
    }
  });
}

function resetFields(context: MyNotesComponent) {
  context.agentNotes = [];
  context.pageNumber = 0;
  context.totalRows = 0;
  context.moreDataAvailable = false;
  context.totalAndCurrentRowsRatio = "";
}
