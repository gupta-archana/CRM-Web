import { Component, Injector, OnInit } from "@angular/core";
import { BaseClass } from "src/app/global/base-class";
import { AgentJournalsModel } from "src/app/models/agent-journals-model";
import { EntityModel } from "src/app/models/entity-model";
import md from "markdown-it";
import { element } from "protractor";

@Component({
    selector: "app-agent-journals",
    templateUrl: "./agent-journals.component.html",
    styleUrls: ["./agent-journals.component.css"],
})
export class AgentJournalsComponent extends BaseClass implements OnInit {
    entityModel: EntityModel;
    agentJournalsModel: Array<AgentJournalsModel> = new Array<AgentJournalsModel>();
    editAgentJournalsModel: Array<AgentJournalsModel> = new Array<AgentJournalsModel>();

    hideNoDataDiv: boolean;
    email: string = "";
    showEditAgentJournalsbutton:boolean = false;
    private markdown: md = md();
    constructor(private injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        this.commonFunctions.showLoadedItemTagOnHeader([], "", true);
        this.entityModel = JSON.parse(sessionStorage.getItem(this.constants.ENTITY_INFO));
        getData(this);
    }

    goBack() {
        this.commonFunctions.backPress();
    }

    onSuccess(response: any) {
        response.agentJournals.forEach((element: AgentJournalsModel) => {
            if (element.Id && element.Latest === true) {
                this.agentJournalsModel.push(element);

                if(element.Username.toLowerCase() == this.email.toLowerCase()){
                    this.editAgentJournalsModel.push(element);
                }
            }
        });         

        this.agentJournalsModel.sort((a, b) => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime());        
        this.renderUI();
    }

    onError(errorCode: number, errorMsg: string) {
        this.commonFunctions.showErrorSnackbar(errorMsg);
    }

    renderUI() {
        setData(this);
        checkAndSetEditAgentJournals(this);
        checkAndSetUi(this);        
        this.cdr.markForCheck();
    }

    getContent(item: AgentJournalsModel) {
        return this.markdown.render(item.Content);
    }

    onEditAgentJournalsClick() {
        this.dataService.onAgentJournalsEditClick(this.editAgentJournalsModel);
    }
}

function getData(context: AgentJournalsComponent) {
    const dataArray = JSON.parse(sessionStorage.getItem(context.constants.AGENT_JOURNAL_ARRAY));
    const entityID = JSON.parse(sessionStorage.getItem(context.constants.AGENT_JOURNAL_ENTITY_ID));
    if (entityID === context.entityModel.entityId && dataArray && dataArray.length > 0) {
        context.agentJournalsModel = dataArray;
        context.renderUI();
    } else {
        makeServerRequest(context);
    }  
    console.log(context.agentJournalsModel);
}

function setData(context: AgentJournalsComponent) {
    sessionStorage.setItem(context.constants.AGENT_JOURNAL_ENTITY_ID, JSON.stringify(context.entityModel.entityId));
    sessionStorage.setItem(context.constants.AGENT_JOURNAL_ARRAY, JSON.stringify(context.agentJournalsModel));
}

function makeServerRequest(context: AgentJournalsComponent) {
    context.apiHandler.getAgentJournals(context.entityModel.entityId, context);
}

function checkAndSetUi(context: AgentJournalsComponent) {
    if (!context.agentJournalsModel || context.agentJournalsModel.length === 0) {
        resetData(context);
    } else {
        context.hideNoDataDiv = true;       
    }   
    context.cdr.markForCheck();
}

function resetData(context: AgentJournalsComponent) {
    context.agentJournalsModel = [];
    context.editAgentJournalsModel = [];
    context.hideNoDataDiv = false;
    context.showEditAgentJournalsbutton = false;
}

function checkAndSetEditAgentJournals(context: AgentJournalsComponent){
    context.email = context.myLocalStorage.getValue(context.constants.EMAIL);
    
    context.agentJournalsModel.forEach((agentJournalsModel:AgentJournalsModel) => {
        if(agentJournalsModel.Id && agentJournalsModel.Latest === true && agentJournalsModel.Username.toLowerCase() == context.email.toLowerCase()){
            context.editAgentJournalsModel.push(agentJournalsModel);
        }        
    });    

    context.showEditAgentJournalsbutton = context.editAgentJournalsModel.length > 0 ? true : false;
}