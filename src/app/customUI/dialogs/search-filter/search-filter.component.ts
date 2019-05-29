import { Component, OnInit, Injector, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { combineAll } from 'rxjs/operators';
import { SearchFilterModel } from '../../../models/search-filter-model';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.css']
})
export class SearchFilterComponent extends BaseClass implements OnInit, OnDestroy {


  constructor(inject: Injector) { super(inject); }

  @ViewChild("closeSearchFilter")
  closeSearchFilter: ElementRef;
  searchFilterModel: SearchFilterModel;
  ascendingOrder: any;
  descendingOrder: any;
  states: Array<any> = [];
  filterForm: FormGroup;
  selectedState: any;

  ngOnInit() {
    this.searchFilterModel = new SearchFilterModel();
    getFilters(this);
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
    this.searchFilterModel.selectedState = event.target.value;
  }

  onApplyClick() {
    this.dataService.onSearchFilterApply(this.searchFilterModel);
    this.saveFilters();
    this.closeSearchFilter.nativeElement.click();
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

  ngOnDestroy(): void {
    
  }

  private saveFilters() {
    sessionStorage.setItem(this.constants.SEARCH_FILTERS, JSON.stringify(this.searchFilterModel));
  }
}

function getFilters(context: SearchFilterComponent) {

  context.searchFilterModel = JSON.parse(sessionStorage.getItem(context.constants.SEARCH_FILTERS));
  if (!context.searchFilterModel)
    context.searchFilterModel = new SearchFilterModel();
}

function addValidation(context: SearchFilterComponent) {
  context.filterForm = new FormGroup({
    allCheck: new FormControl(context.searchFilterModel.allCheck),
    agentCheck: new FormControl(context.searchFilterModel.agentCheck),
    peopleCheck: new FormControl(context.searchFilterModel.peopleCheck),
    employeeCheck: new FormControl(context.searchFilterModel.employeeCheck),
    selectedState: new FormControl(context.searchFilterModel.selectedState)
  })
}


function getStates(context: SearchFilterComponent) {
  context.apiHandler.getStates({
    onSuccess(response: any) {
      context.states = response;
      if (!context.searchFilterModel.selectedState)
        context.searchFilterModel.selectedState = context.states[0].stateID;
      setValueInForm(context);
      context.cdr.markForCheck();
    }, onError(errorCode: number, errorMsg: string) {

    }
  })
}

function setValueInForm(context: SearchFilterComponent) {
  Object.keys(context.filterForm.controls).forEach(key => {
    let value = context.searchFilterModel[key];
    context.filterForm.get(key).setValue(value);

  });
}

function setValueToChecks(context: SearchFilterComponent, value: boolean) {
  context.filterForm.get("allCheck").setValue(value);
  context.filterForm.get("agentCheck").setValue(value);
  context.filterForm.get("peopleCheck").setValue(value);
  context.filterForm.get("employeeCheck").setValue(value);
}
