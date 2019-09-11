import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseClass } from '../../../../global/base-class';
import { NotesModel } from '../../../../models/notes-model';
import { EntityModel } from '../../../../models/entity-model';

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
  uid: string;
  entityModel: EntityModel;
  tabIndexSubscription: Subscription;
  newNoteAddedSubscription: Subscription;
  updatedNoteSubscription: Subscription;
  agentNotes: Array<NotesModel> = new Array<NotesModel>();
  selectedTabIndex: number = 0;
  selectedNoteIndex: number = -1;
  ngOnInit() {
    this.uid = this.commonFunctions.getLoginCredentials().email;
    this.entityModel = JSON.parse(sessionStorage.getItem(this.constants.ENTITY_INFO));
    tabSelectedIndexSubscription(this);
    onNewNoteAdded(this);
    getUpdatedNote(this);
  }
  onLoadMoreClick() {
    makeServerRequest(this);
  }


  onEditClick(item: NotesModel, i: number) {
    this.dataService.onDataShare(item);
    this.selectedNoteIndex = i;
  }
  onDeleteClick(item: NotesModel, i: number) {
    let self = this;
    this.apiHandler.deleteNote(item.sysNoteID, {
      onSuccess(response: any) {
        self.onDeleteSuccess(i);
      }, onError(errorCode: number, errorMsg: string) {
        this.commonFunctions.showErrorSnackbar(errorMsg)
      }
    })
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
    this.commonFunctions.showErrorSnackbar(errorMsg)
  }


  private onDeleteSuccess(i: number) {
    this.agentNotes.splice(i, 1);
    this.totalRows = this.totalRows - 1;
    this.onDataChanged();
  }

  onDataChanged() {
    this.dataService.onTabSelected(1);
    this.dataService.onDataUpdated();
    this.renderUI();
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
    context.selectedTabIndex = index;
    if (index == 1 && context.agentNotes.length <= 0) {
      makeServerRequest(context);
    }
  });
}
function makeServerRequest(context: MyNotesComponent) {
  context.pageNumber++;
  context.apiHandler.getNotes(context.uid, context.entityModel.type, context.entityModel.entityId, context.pageNumber, context);
}

function updateRatioUI(context: MyNotesComponent) {
  context.commonFunctions.showLoadedItemTagOnHeader(context.agentNotes, context.totalRows);
  //context.totalAndCurrentRowsRatio = context.commonFunctions.showMoreDataSnackbar(context.agentNotes, context.totalRows);
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
    if (data)
      resetFields(context);
    if (context.selectedTabIndex == 1) {
      makeServerRequest(context);
    }
  });
}

function getUpdatedNote(context: MyNotesComponent) {
  context.updatedNoteSubscription = context.dataService.shareUpdateNoteObservable.subscribe(data => {
    if (context.selectedNoteIndex != -1) {
      context.agentNotes[context.selectedNoteIndex].notes = data;
      context.dataService.onTabSelected(1);
      context.cdr.markForCheck();
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
