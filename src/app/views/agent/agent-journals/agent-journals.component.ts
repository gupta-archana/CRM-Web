import { Component, Injector, OnInit } from "@angular/core";
import { BaseClass } from "src/app/global/base-class";
import { AgentJournalsModel } from "src/app/models/agent-journals-model";
import { EntityModel } from "src/app/models/entity-model";
import md from "markdown-it";

@Component({
    selector: "app-agent-journals",
    templateUrl: "./agent-journals.component.html",
    styleUrls: ["./agent-journals.component.css"],
})
export class AgentJournalsComponent extends BaseClass implements OnInit {
    entityModel: EntityModel;
    agentJournalsModel: Array<AgentJournalsModel> =
        new Array<AgentJournalsModel>();
    hideNoDataDiv: boolean;
    private markdown: md = md();
    constructor(private injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        this.commonFunctions.showLoadedItemTagOnHeader([], "", true);
        this.entityModel = JSON.parse(
            sessionStorage.getItem(this.constants.ENTITY_INFO)
        );
        getData(this);
    }

    goBack() {
        this.commonFunctions.backPress();
    }

    onSuccess(response: any) {        
        response.agentJournals.forEach((element: AgentJournalsModel) => {
            if (element.Id && element.Latest === true) {
                this.agentJournalsModel.push(element);
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
        checkAndSetUi(this);
        this.cdr.markForCheck();
    }

    getContent(item: AgentJournalsModel){
        return this.markdown.render(item.Content);       
    }
}

function getData(context: AgentJournalsComponent) {
    const dataArray = JSON.parse(
        sessionStorage.getItem(context.constants.AGENT_JOURNAL_ARRAY)
    );
    const entityID = JSON.parse(
        sessionStorage.getItem(context.constants.AGENT_JOURNAL_ENTITY_ID)
    );
    if (
        entityID === context.entityModel.entityId &&
        dataArray &&
        dataArray.length > 0
    ) {
        context.agentJournalsModel = dataArray;
        context.renderUI();
    } else {
        makeServerRequest(context);
    }

    console.log(context.agentJournalsModel);
}

function setData(context: AgentJournalsComponent) {
    sessionStorage.setItem(
        context.constants.AGENT_JOURNAL_ENTITY_ID,
        JSON.stringify(context.entityModel.entityId)
    );
    sessionStorage.setItem(
        context.constants.AGENT_JOURNAL_ARRAY,
        JSON.stringify(context.agentJournalsModel)
    );
}

function makeServerRequest(context: AgentJournalsComponent) {
    context.apiHandler.getAgentJournals(context.entityModel.entityId, context);
}

function checkAndSetUi(context: AgentJournalsComponent) {
    if (
        !context.agentJournalsModel ||
        context.agentJournalsModel.length === 0
    ) {
        resetData(context);
    } else {
        context.hideNoDataDiv = true;
    }
    context.cdr.markForCheck();
}

function resetData(context: AgentJournalsComponent) {
    context.agentJournalsModel = [];
    context.hideNoDataDiv = false;
}
