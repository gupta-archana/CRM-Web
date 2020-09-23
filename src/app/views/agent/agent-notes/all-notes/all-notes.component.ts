import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseClass } from '../../../../global/base-class';
import { Subscription } from 'rxjs';
import { NotesModel } from '../../../../models/notes-model';
import { ApiResponseCallback } from '../../../../Interfaces/ApiResponseCallback';
import { EntityModel } from '../../../../models/entity-model';

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
  updatedNoteSubscription: Subscription;
  agentNotes: Array<NotesModel> = new Array<NotesModel>();
  selectedTabIndex: number = 0;
  selectedNoteIndex: number = -1;
  hideNoDataDiv: boolean = false;
  errorMsg: string = "";
  entityModel: EntityModel;
  ngOnInit() {
    this.uid = this.commonFunctions.getLoginCredentials().email;
    this.entityModel = JSON.parse(sessionStorage.getItem(this.constants.ENTITY_INFO));
    this.selectedNoteIndex = -1;
    tabSelectedIndexSubscription(this);
    onNewNoteAdded(this);
    getUpdatedNote(this);
  }

  getNotesType(item: NotesModel) {
    if (item.uid === this.entityModel.email) {
      return this.MY_NOTES
    }
    else {
      return item.uid;
    }
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
    this.apiHandler.deleteNote(item.agentID, {
      onSuccess(response: any) {
        self.onDeleteSuccess(i);
      }, onError(errorCode: number, errorMsg: string) {
        this.commonFunctions.showErrorSnackbar(errorMsg)
      }
    })
  }

  onSuccess(response: any) {
    let data: NotesModel[] = response.AgentNote;
    data.forEach(element => {
      if (element.notes) {
        if(element.category ==='1')
        element.category = "General"
        else if(element.category ==='2')
        element.category = "Events"
        else if(element.category ==='3')
        element.category = "Opportunities"
        else if(element.category ==='4')
        element.category = "Issues"
        else
        element.category = ""
 
       // element.dateCreated = element.dateCreated.split(" ")[0];
        this.agentNotes.push(element);
      } else {
        this.totalRows = element.rowNum;
      }
    });
    this.renderUI();
  }
  onError(errorCode: number, errorMsg: string) {
    this.errorMsg = errorMsg;
    this.renderUI();
    //this.commonFunctions.showErrorSnackbar(errorMsg)
  }


  private onDeleteSuccess(i: number) {
    this.agentNotes.splice(i, 1);
    this.totalRows = this.totalRows - 1;
    this.onDataChanged();
  }

  onDataChanged() {
    this.dataService.onTabSelected(0);
    this.dataService.onDataUpdated();
    this.renderUI();
  }

  public renderUI() {
    updateRatioUI(this);
    checkAndSetUi(this);
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
    context.selectedTabIndex = index;
    if (index == 0) {
      updateRatioUI(context);
      if (context.agentNotes.length <= 0) {
        makeServerRequest(context);
      }
    }
  });
}
function makeServerRequest(context: AllNotesComponent) {
  context.pageNumber++;
  context.apiHandler.getNotes(context.ALL, context.entityModel.type, context.entityModel.entityId, context.pageNumber, context);
}

function updateRatioUI(context: AllNotesComponent) {
  context.commonFunctions.showLoadedItemTagOnHeader(context.agentNotes, context.totalRows);
  //context.totalAndCurrentRowsRatio = context.commonFunctions.showMoreDataSnackbar(context.agentNotes, context.totalRows);
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
    if (context.selectedTabIndex == 0) {
      makeServerRequest(context);
    }
  });
}

function getUpdatedNote(context: AllNotesComponent) {
  context.updatedNoteSubscription = context.dataService.shareUpdateNoteObservable.subscribe(data => {
    if (context.selectedNoteIndex != -1) {
      context.agentNotes[context.selectedNoteIndex].notes = data;
      context.dataService.onTabSelected(0);
      context.cdr.markForCheck();
    }
  });
}


function checkAndSetUi(context: AllNotesComponent) {
  if (!context.agentNotes || context.agentNotes.length == 0) {
    resetFields(context);
  }
  else {
    context.hideNoDataDiv = true;
  }
  context.cdr.markForCheck();
}

function resetFields(context: AllNotesComponent) {
  context.pageNumber = 0;
  context.agentNotes = [];
  context.totalRows = 0;
  context.moreDataAvailable = false;
  context.hideNoDataDiv = false;
}

