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
export class AgentNotesComponent extends BaseClass implements OnInit {

  constructor(private injector: Injector) {
    super(injector);
  }
  entityModel: EntityModel;
  entityInfo: any;
  agentNotes: Array<NotesModel> = new Array;

  ngOnInit() {
    this.entityModel = JSON.parse(sessionStorage.getItem(this.constants.ENTITY_INFO));
    shareTabIndexToChilds(this, 0);
  }

  goBack() {
    this.commonFunctions.backPress();
  }


  onTabSelect(event) {
    //this.commonFunctions.showSnackbar(event.index);
    this.commonFunctions.printLog(event);
    shareTabIndexToChilds(this, event.index);
  }
}
function shareTabIndexToChilds(context: AgentNotesComponent, index: number) {
  context.dataService.onTabSelected(index);
}

