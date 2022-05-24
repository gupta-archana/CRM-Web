import {
    Component,
    OnInit,
    Injector,
    ViewChild,
    ElementRef,
    OnDestroy,
} from "@angular/core";
import { BaseClass } from "../../../global/base-class";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { combineAll } from "rxjs/operators";
import { SearchFilterModel } from "../../../models/search-filter-model";

@Component({
    selector: "app-search-filter",
    templateUrl: "./search-filter.component.html",
    styleUrls: ["./search-filter.component.css"],
})
export class SearchFilterComponent
    extends BaseClass
    implements OnInit, OnDestroy {
    constructor(inject: Injector) {
        super(inject);
    }

    @ViewChild("closeSearchFilter", { static: true })
        closeSearchFilter: ElementRef;
    searchFilterModel: SearchFilterModel;
    ascendingOrder: any;
    descendingOrder: any;
    states: Array<any> = [];
    filterForm: FormGroup;
    selectedState: any;

    ALL_CHECK = "allCheck";
    AGENT_CHECK = "agentCheck";
    PEOPLE_CHECK = "peopleCheck";
    EMPLOYEE_CHECK = "employeeCheck";

    ngOnInit() {
        this.searchFilterModel = new SearchFilterModel();
        getFilters(this);
        this.ascendingOrder = document.getElementById("ascendingOrder");
        this.descendingOrder = document.getElementById("descendingOrder");

        addValidation(this);
        getStates(this);
    }

    onAllCheckChange(event) {
        this.searchFilterModel.allCheck = event.target.checked;
        setValueToChecks(this, this.searchFilterModel.allCheck);
    }

    onAgentCheckChange(event) {
        this.searchFilterModel.agentCheck = event.target.checked;
        this.checkAllChecked();
    }

    onPeopleCheckChange(event) {
        this.searchFilterModel.peopleCheck = event.target.checked;
        this.checkAllChecked();
    }

    onEmployeeCheckChange(event) {
        this.searchFilterModel.employeeCheck = event.target.checked;
        this.checkAllChecked();
    }

    onStateChanged(event) {
        this.searchFilterModel.selectedState = event.target.value;
    }

    checkAllChecked() {
        if (
            getCheckValue(this, this.AGENT_CHECK) &&
      getCheckValue(this, this.PEOPLE_CHECK) &&
      getCheckValue(this, this.EMPLOYEE_CHECK)
        ) {
            this.filterForm.get(this.ALL_CHECK).setValue(true);
        } else {
            this.filterForm.get(this.ALL_CHECK).setValue(false);
        }
    }

    onApplyClick() {
        this.dataService.onSearchFilterApply(this.getCheckModel());
        this.saveFilters();
        this.closeSearchFilter.nativeElement.click();
    }

    getCheckModel() {
        this.searchFilterModel.allCheck = getCheckValue(this, this.ALL_CHECK);
        this.searchFilterModel.agentCheck = getCheckValue(this, this.AGENT_CHECK);
        this.searchFilterModel.peopleCheck = getCheckValue(this, this.PEOPLE_CHECK);
        this.searchFilterModel.employeeCheck = getCheckValue(
            this,
            this.EMPLOYEE_CHECK
        );

        return this.searchFilterModel;
    }

    ngOnDestroy(): void {}

    private saveFilters() {
        sessionStorage.setItem(
            this.constants.SEARCH_FILTERS,
            JSON.stringify(this.searchFilterModel)
        );
    }
}

function getFilters(context: SearchFilterComponent) {
    context.searchFilterModel = JSON.parse(
        sessionStorage.getItem(context.constants.SEARCH_FILTERS)
    );
    if (!context.searchFilterModel) {
        context.searchFilterModel = new SearchFilterModel();
    }
}

function addValidation(context: SearchFilterComponent) {
    context.filterForm = new FormGroup({
        allCheck: new FormControl(context.searchFilterModel.allCheck),
        agentCheck: new FormControl(context.searchFilterModel.agentCheck),
        peopleCheck: new FormControl(context.searchFilterModel.peopleCheck),
        employeeCheck: new FormControl(context.searchFilterModel.employeeCheck),
        selectedState: new FormControl(context.searchFilterModel.selectedState),
    });
}

function getStates(context: SearchFilterComponent) {
    context.apiHandler.getStates({
        onSuccess(response: any) {
            context.states = response;
            context.states.splice(0, 0, getStateTypeAll());
            if (!context.searchFilterModel.selectedState) {
                context.searchFilterModel.selectedState = context.states[0].stateID;
            }
            setValueInForm(context);
            context.cdr.markForCheck();
        },
        onError(errorCode: number, errorMsg: string) {},
    });
}

function setValueInForm(context: SearchFilterComponent) {
    Object.keys(context.filterForm.controls).forEach((key) => {
        const value = context.searchFilterModel[key];
        context.filterForm.get(key).setValue(value);
    });
}

function setValueToChecks(context: SearchFilterComponent, value: boolean) {
    if (
        value === true ||
    (getCheckValue(context, context.AGENT_CHECK) &&
      getCheckValue(context, context.PEOPLE_CHECK) &&
      getCheckValue(context, context.EMPLOYEE_CHECK))
    ) {
        context.filterForm.get(context.ALL_CHECK).setValue(value);
        context.filterForm.get(context.AGENT_CHECK).setValue(value);
        context.filterForm.get(context.PEOPLE_CHECK).setValue(value);
        context.filterForm.get(context.EMPLOYEE_CHECK).setValue(value);
    }
}

function getCheckValue(context: SearchFilterComponent, checkFor: any) {
    return context.filterForm.get(checkFor).value;
}
function getStateTypeAll() {
    return { stateID: "All", description: "All" };
}
