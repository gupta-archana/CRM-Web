import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { EntityModel } from '../../../models/entity-model';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { NotesModel } from '../../../models/notes-model';


@Component({
  selector: 'app-agent-notes',
  templateUrl: './agent-notes.component.html',
  styleUrls: ['./agent-notes.component.css']
})
export class AgentNotesComponent extends BaseClass implements OnInit, ApiResponseCallback {

  constructor(private injector: Injector) {
    super(injector);
  }
  agentInfo: EntityModel;
  entityInfo: any;
  agentNotes: Array<NotesModel> = new Array;

  ngOnInit() {
    this.agentInfo = JSON.parse(sessionStorage.getItem(this.constants.ENTITY_INFO));
    getNotes(this);
  }

  goBack(){
    this.commonFunctions.backPress();
  }
  onSuccess(response: any) {
    let notes: Array<NotesModel> = response.sysNote;
    notes.forEach(element => {
      if (element.dateCreated)
        element.dateCreated = element.dateCreated.split(" ")[0];
      this.agentNotes.push(element);
    });

    this.dataService.onDataShare(this.agentNotes);
  }
  onError(errorCode: number, errorMsg: string) {
    this.commonFunctions.showErrorSnackbar(errorMsg);
  }
}

function getNotes(context: AgentNotesComponent) {
  context.apiHandler.getNotes(context.agentInfo.type, context.agentInfo.entityId, context);
}
