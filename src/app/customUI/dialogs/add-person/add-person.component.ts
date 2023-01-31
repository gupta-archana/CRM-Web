import { Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Constants } from 'src/app/Constants/Constants';
import { BaseClass } from 'src/app/global/base-class';
import { ApiResponseCallback } from 'src/app/Interfaces/ApiResponseCallback';
import { EntityContactModel } from 'src/app/models/entity-contact-model';
import { Subscription } from "rxjs";
import { PersonEntityModel } from 'src/app/models/person-entity-model';


@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.css']
})
export class AddPersonComponent extends BaseClass implements OnInit, ApiResponseCallback {
  @ViewChild("closeAddPersonEntityModel", { static: true }) closeAddPersonEntityModel: ElementRef;

  states: Array<any> = [];
  addPersonEntity: PersonEntityModel = new PersonEntityModel();
  addPersonEntityInfo: FormGroup;
  createClicked: boolean;
  dispName: Array<any> = [];
  othersPanelOpenState: boolean = false;
  addressPanelOpenState: boolean = false;
  contactsPanelOpenState: boolean = false;
  npnPanelOpenState: boolean = false;
  isValidContact: boolean;

  constructor(private injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    createPersonForm(this);
    getStates(this);
  }

  onError(errorCode: number, errorMsg: string) {
    this.commonFunctions.showErrorSnackbar(this.constants.CREATE_FAIL);
  }

  onSuccess(response: any) {
    this.dataService.onDataUpdated();
    this.commonFunctions.showSnackbar("Person" + " " + this.constants.CREATE_SUCCESS);
    this.closeAddPersonEntityModel.nativeElement.click();
    this.setDefaultValues();
  }

  onTitleChanged(event) {
    this.commonFunctions.printLog(JSON.stringify(event.target.value));
    this.addPersonEntityInfo.get("title").setValue(event.target.value);
  }

  onStateChanged(event) {
    this.commonFunctions.printLog(JSON.stringify(event.target.value));
    this.addPersonEntityInfo.get("state").setValue(event.target.value);
  }

  onSaveClick() {
    this.createClicked = true;
    if (this.addPersonEntityInfo.valid) {
      const requestJson = createRequestJson(this);
      this.apiHandler.addPersonEntity(requestJson, this);
    }
    else {
      this.contactsPanelOpenState = true;
    }
  }

  onCancelClick() {
    this.addPersonEntityInfo.reset(this.addPersonEntity);
    this.setDefaultValues();
  }

  setDefaultValues() {
    this.createClicked = false;
    this.addressPanelOpenState = false;
    this.contactsPanelOpenState = false;
    this.othersPanelOpenState = false;
    this.npnPanelOpenState = false;
  }

  clickOthersPanel() {
    this.othersPanelOpenState = !this.othersPanelOpenState;
  }

  clickContactsPanel() {
    this.contactsPanelOpenState = !this.contactsPanelOpenState;
  }

  clickAddressPanel() {
    this.addressPanelOpenState = !this.addressPanelOpenState;
  }

  clickNPNPanel() {
    this.npnPanelOpenState = !this.npnPanelOpenState;
  }

  validateContactNumber(formControlName: string, contactString: string) {
    const status = this.commonFunctions.formatPhoneNumber(contactString);

    if (status.isValid) {
      this.addPersonEntityInfo.get(formControlName).setValue(status.formattedContactString);
    }
    else {
      this.addPersonEntityInfo.get(formControlName).setErrors({ incorrect: true });
    }
  }
}

function createPersonForm(context: AddPersonComponent) {
  context.addPersonEntityInfo = new FormGroup({
    personID: new FormControl(""),
    NPN: new FormControl(""),
    altaUID: new FormControl(""),
    address1: new FormControl(""),
    address2: new FormControl(""),
    city: new FormControl(""),
    state: new FormControl(""),
    county: new FormControl(""),
    zip: new FormControl(""),
    email: new FormControl(""),
    phone: new FormControl(""),
    mobile: new FormControl(""),
    active: new FormControl(false),
    notes: new FormControl(""),
    title: new FormControl(""),
    firstName: new FormControl("", Validators.required),
    middleName: new FormControl(""),
    lastName: new FormControl(""),
    dispName: new FormControl(""),
    picture: new FormControl(""),
    internal: new FormControl(false),
    doNotCall: new FormControl(false)
  },
    {
      validators: atLeastOne(context, Validators.required, ["phone", "mobile", "email"])
    });
}

function getStates(context: AddPersonComponent) {
  context.apiHandler.getStates({
    onSuccess(response: any) {
      context.states = response;
      setValueInFormControls(context);
      context.cdr.markForCheck();
    },
    onError(errorCode: number, errorMsg: string) { },
  });
}

function setValueInFormControls(context: AddPersonComponent) {
  Object.keys(context.addPersonEntityInfo.controls).forEach((key) => {
    const value = context.addPersonEntity[key];
    context.addPersonEntityInfo.get(key).setValue(value);
  });

  context.addPersonEntityInfo.get('firstName').valueChanges.subscribe((fName) => {
    context.dispName[0] = fName;
    setDispValue(context);
  });

  context.addPersonEntityInfo.get('middleName').valueChanges.subscribe((mName) => {
    context.dispName[1] = mName;
    setDispValue(context);
  });

  context.addPersonEntityInfo.get('lastName').valueChanges.subscribe((lName) => {
    context.dispName[2] = lName;
    setDispValue(context);
  });
}

function setDispValue(context) {
  if (!context.addPersonEntityInfo.get('dispName').dirty) {
    let fullName: any;
    context.dispName.forEach((value: any) => {
      fullName ? fullName = fullName + ' ' + value.trim() : fullName = value.trim();
    });
    context.addPersonEntityInfo.get('dispName').setValue(fullName);
  }
}

function createRequestJson(context: AddPersonComponent) {
  const requestJson = {};
  Object.keys(context.addPersonEntityInfo.controls).forEach((key) => {
    requestJson[key] = context.addPersonEntityInfo.get(key).value;
  });

  requestJson['phone'] = context.commonFunctions.unFormatPhoneNumber(context.addPersonEntityInfo.get('phone').value);
  requestJson['mobile'] = context.commonFunctions.unFormatPhoneNumber(context.addPersonEntityInfo.get('mobile').value);

  const finalJson = {
    Person: "",
    attr: requestJson,
  };
  context.commonFunctions.printLog(JSON.stringify(finalJson));
  return finalJson;
}


const atLeastOne = (context: AddPersonComponent, validator: ValidatorFn, controls: string[] = null) => (group: FormGroup): ValidationErrors | null => {
  if (!controls) {
    controls = Object.keys(group.controls)
  }

  const hasAtLeastOne = group && group.controls && controls.some(k => !validator(group.controls[k]));

  hasAtLeastOne ? context.isValidContact = true : context.isValidContact = false;

  return hasAtLeastOne ? null : {
    atLeastOne: true,
  };
};

