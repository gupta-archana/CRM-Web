import {
    Component,
    ElementRef,
    Injector,
    OnInit,
    ViewChild,
} from "@angular/core";
import { Subscription } from "rxjs";
import { BaseClass } from "src/app/global/base-class";
import { AgentJournalsModel } from "src/app/models/agent-journals-model";
import md from "markdown-it";

@Component({
    selector: "app-edit-agent-journals",
    templateUrl: "./edit-agent-journals.component.html",
    styleUrls: ["./edit-agent-journals.component.css"],
})
export class EditAgentJournalsComponent extends BaseClass implements OnInit {
    @ViewChild("closeEditAgentJournalsModel", { static: true })
    closeEditAgentJournalsModel: ElementRef;

    agentJournalsEditSubscription: Subscription = null;

    agentJournalsModel: AgentJournalsModel = new AgentJournalsModel();
    agentJournalsContent: string = "";
    agentJournalsFormattedContent: string = "";
    private markdown: md = md();
    constructor(private injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        registerDataSubscription(this);
    }

    getFormattedContent() {
        return this.markdown.render(this.agentJournalsContent);
    }

    onSaveClick() {
        const requestJson = createRequestJson(this);
        this.apiHandler.modifyAgentJournal(requestJson, this);
    }

    onSuccess(response: any) {
        this.commonFunctions.showSnackbar(
            "Agent Journal" + " " + this.constants.UPDATe_SUCCESS
        );
        this.dataService.onDataUpdated();
        this.closeEditAgentJournalsModel.nativeElement.click();
    }
    onError(errorCode: number, errorMsg: string) {
        this.commonFunctions.showErrorSnackbar(
            "Agent Journal" + " " + this.constants.UPDATED_FAIL
        );
    }
}

function registerDataSubscription(context: EditAgentJournalsComponent) {
    context.agentJournalsEditSubscription =
        context.dataService.editAgentJournalsDialogObservable.subscribe(
            (agentJournalsModel) => {
                agentJournalsModel.forEach((item: AgentJournalsModel) => {
                    context.agentJournalsModel = item;
                });
                setValueInFormControls(context);
            }
        );
}

function setValueInFormControls(context: EditAgentJournalsComponent) {
    context.agentJournalsContent = context.agentJournalsModel["Content"];
}

function createRequestJson(context: EditAgentJournalsComponent) {
    const requestJson = {};

    Object.keys(context.agentJournalsModel).forEach((key) => {
        const value = context.agentJournalsModel[key];
        requestJson[key] = value;
    });

    requestJson["Content"] = context.agentJournalsContent;

    return requestJson;
}
