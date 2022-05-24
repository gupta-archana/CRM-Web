import {
    Component,
    OnInit,
    OnDestroy,
    Injector,
    ViewChild,
    ElementRef,
} from "@angular/core";
import { Subscription } from "rxjs";
import { BaseClass } from "../../../global/base-class";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { EntityContactModel } from "../../../models/entity-contact-model";
import { ApiResponseCallback } from "../../../Interfaces/ApiResponseCallback";
import { Constants } from "src/app/Constants/Constants";

@Component({
    selector: "app-update-agent-profile",
    templateUrl: "./update-agent-profile.component.html",
    styleUrls: ["./update-agent-profile.component.css"],
})
export class UpdateAgentProfileComponent
    extends BaseClass
    implements OnInit, OnDestroy, ApiResponseCallback {
    @ViewChild("closeEntityUpdateProfileModel", { static: true })
        closeEntityUpdateProfileModel: ElementRef;
    showAgentProfileDialog = false;
    agentProfileEditSubscription: Subscription = null;
    entityInfoForm: FormGroup;
    entitiyContactModel: EntityContactModel = new EntityContactModel();
    states: Array<any> = [];
    submitClicked = false;
    constants: Constants;
    constructor(private injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        addValidation(this);
        registerDataSubscription(this);
    }

    onStateChanged(event) {
        this.commonFunctions.printLog(JSON.stringify(event.target.value));
        this.entityInfoForm.get("state").setValue(event.target.value);
    }

    onSaveClick() {
        this.submitClicked = true;
        if (this.entityInfoForm.valid) {
            const requestJson = createRequestJson(this);
            this.apiHandler.updateEntityProfile(requestJson, this);
        }
    }

    onCancelClick() {
    // this.openModal(false);
    }

    onSuccess(response: any) {
        this.commonFunctions.showSnackbar(
            "Agent Profile" + " " + this.constants.UPDATe_SUCCESS
        );
        this.dataService.onDataUpdated();
        this.closeEntityUpdateProfileModel.nativeElement.click();
    }
    onError(errorCode: number, errorMsg: string) {
        this.commonFunctions.showErrorSnackbar(
            "Agent Profile" + " " + this.constants.UPDATED_FAIL
        );
    }
    ngOnDestroy(): void {
        if (
            this.agentProfileEditSubscription &&
      !this.agentProfileEditSubscription.closed
        ) {
            this.agentProfileEditSubscription.unsubscribe();
        }
    }
}
function addValidation(context: UpdateAgentProfileComponent) {
    const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    context.entityInfoForm = new FormGroup({
        zip: new FormControl(""),
        name: new FormControl(""),
        addr1: new FormControl(""),
        addr2: new FormControl(""),
        addr3: new FormControl(""),
        addr4: new FormControl(""),
        phone1: new FormControl(""),
        phone2: new FormControl(""),
        state: new FormControl(""),
        email: new FormControl(""),
        city: new FormControl(""),
    });
}

function registerDataSubscription(context: UpdateAgentProfileComponent) {
    context.agentProfileEditSubscription =
    context.dataService.editAgentProfileDialogObservable.subscribe(
        (entityContactModel) => {
            context.entitiyContactModel = entityContactModel;
            getStates(context);
        }
    );
}

function getStates(context: UpdateAgentProfileComponent) {
    context.apiHandler.getStates({
        onSuccess(response: any) {
            context.states = response;
            setValueInFormControls(context);
            context.cdr.markForCheck();
        },
        onError(errorCode: number, errorMsg: string) {},
    });
}

function setValueInFormControls(context: UpdateAgentProfileComponent) {
    Object.keys(context.entityInfoForm.controls).forEach((key) => {
        const value = context.entitiyContactModel[key];
        context.entityInfoForm.get(key).setValue(value);
    });
}

function createRequestJson(context: UpdateAgentProfileComponent) {
    const requestJson = {};
    Object.keys(context.entityInfoForm.controls).forEach((key) => {
        const value = context.entityInfoForm.get(key).value;
        requestJson[key] = value;
    });

    requestJson["entity"] = context.entitiyContactModel.entity;
    requestJson["entityID"] = context.entitiyContactModel.entityID;
    const finalJson = {
        EntityContact: "",
        attr: requestJson,
    };
    context.commonFunctions.printLog(JSON.stringify(finalJson));
    return finalJson;
}
