import { Component, OnInit, Injector, ViewChild, ElementRef } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { combineAll } from 'rxjs/operators';
import { SearchFilterModel } from '../../../models/search-filter-model';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.css']
})
export class SearchFilterComponent extends BaseClass implements OnInit {

  constructor(inject: Injector) { super(inject); }

  searchFilterModel: SearchFilterModel;
  ascendingOrder: any;
  descendingOrder: any;
  states: Array<any> = [];
  filterForm: FormGroup;
  selectedState: any;

  ngOnInit() {
    this.searchFilterModel = new SearchFilterModel();
    this.ascendingOrder = document.getElementById("ascendingOrder");
    this.descendingOrder = document.getElementById("descendingOrder");

    addValidation(this);
    getStates(this);
    this.registerBtnClicks();
  }

  onAllCheckChange(event) {
    this.searchFilterModel.allCheck = event.target.checked;
    setValueToChecks(this, this.searchFilterModel.allCheck);
  }

  onAgentCheckChange(event) {
    this.searchFilterModel.agentCheck = event.target.checked;
  }

  onPeopleCheckChange(event) {
    this.searchFilterModel.peopleCheck = event.target.checked;
  }

  onEmployeeCheckChange(event) {
    this.searchFilterModel.employeeCheck = event.target.checked;
  }

  onStateChanged(event) {
    this.selectedState = event.target.value;
  }

  onApplyClick() {
    this.searchFilterModel.selectedState = this.selectedState;
    this.dataService.onSearchFilterApply(this.searchFilterModel);
  }


  registerBtnClicks() {
    var header = document.getElementById("addRemoveWp");
    var btns = header.getElementsByClassName("btn-a-z");
    let self = this;
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function() {
        var current = document.getElementsByClassName("activeAz");
        if (current[0] == self.ascendingOrder) {
          self.searchFilterModel.ascendingOrder = false;
        } else {
          self.searchFilterModel.ascendingOrder = true;
        }
        current[0].className = current[0].className.replace(" activeAz", "");
        this.className += " activeAz";
      });
    }
  }
}


function addValidation(context: SearchFilterComponent) {
  context.filterForm = new FormGroup({
    allCheck: new FormControl(context.searchFilterModel.allCheck),
    agentCheck: new FormControl(context.searchFilterModel.agentCheck),
    peopleCheck: new FormControl(context.searchFilterModel.peopleCheck),
    employeeCheck: new FormControl(context.searchFilterModel.employeeCheck),
    selectedState: new FormControl(context.searchFilterModel.selectedState),
  })
}


function getStates(context: SearchFilterComponent) {
  context.apiHandler.getStates({
    onSuccess(response: any) {
      context.states = response;
      context.searchFilterModel.selectedState = context.states[0];
      setValueInForm(context, "selectedState", context.selectedState.description);
      context.cdr.markForCheck();
    }, onError(errorCode: number, errorMsg: string) {

    }
  })
}

function setValueInForm(context: SearchFilterComponent, key, value) {
  context.filterForm.get(key).setValue(value);
}

function setValueToChecks(context: SearchFilterComponent, value: boolean) {
  context.filterForm.get("allCheck").setValue(value);
  context.filterForm.get("agentCheck").setValue(value);
  context.filterForm.get("peopleCheck").setValue(value);
  context.filterForm.get("employeeCheck").setValue(value);

}
