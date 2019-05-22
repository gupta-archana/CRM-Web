import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.css']
})
export class SearchFilterComponent extends BaseClass implements OnInit {

  constructor(inject: Injector) { super(inject); }
  allCheck = false;
  agentCheck = false;
  peopleCheck = false;
  employeeCheck = true;

  selectedState: any;
  states: Array<any> = [];
  filterForm: FormGroup;

  ngOnInit() {
    addValidation(this);
    getStates(this);
    this.registerBtnClicks();
  }

  onAllCheckChange(event) {
    this.allCheck = event.target.value;
  }

  onAgentCheckChange(event) {
    this.agentCheck = event.target.value;
  }

  onPeopleCheckChange(event) {
    this.peopleCheck = event.target.value;
  }

  onEmployeeCheckChange(event) {
    this.employeeCheck = event.target.value;
  }

  onStateChanged(event) {
    this.selectedState = event.target.value;
  }

  onApplyClick() {
    this.commonFunctions.printLog(this.allCheck + "," + this.agentCheck + "," + this.peopleCheck + "," + this.employeeCheck);
  }


  registerBtnClicks() {
    var header = document.getElementById("addRemoveWp");
    var btns = header.getElementsByClassName("btn-a-z");
    let self = this;
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function() {
        var current = document.getElementsByClassName("activeAz");
        self.commonFunctions.printLog(current.item);
        current[0].className = current[0].className.replace(" activeAz", "");
        this.className += " activeAz";
      });
    }
  }
}


function addValidation(context: SearchFilterComponent) {
  context.filterForm = new FormGroup({
    allCheck: new FormControl(context.allCheck),
    agentCheck: new FormControl(context.agentCheck),
    peopleCheck: new FormControl(context.peopleCheck),
    employeeCheck: new FormControl(context.employeeCheck),
    selectedState: new FormControl(context.selectedState),
  })
}


function getStates(context: SearchFilterComponent) {
  context.apiHandler.getStates({
    onSuccess(response: any) {
      context.states = response;
      context.selectedState = context.states[0];
      setValueInForm(context, "selectedState", context.selectedState.description);
      context.cdr.markForCheck();
    }, onError(errorCode: number, errorMsg: string) {

    }
  })
}

function setValueInForm(context: SearchFilterComponent, key, value) {
  context.filterForm.get(key).setValue(value);
}
