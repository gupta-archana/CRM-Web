import { Component, OnInit, Injector } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseClass } from '../../../global/base-class';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent extends BaseClass implements OnInit, ApiResponseCallback {

  filterSubscription: Subscription = null;
  searchForm: FormGroup;
  searchedUsers: Array<any> = [];
  hideNoDataDiv: boolean = false;
  emailId;
  encryptedPassword;
  searchString: string = "Dav";
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.emailId = this.myLocalStorage.getValue(this.constants.EMAIL);
    this.encryptedPassword = this.commonFunctions.getEncryptedPassword(this.myLocalStorage.getValue(this.constants.PASSWORD));
    this.addValidation();


  }


  onSubmit() {

    if (!this.searchForm.valid) {
      this.commonFunctions.showErrorSnackbar("Search field must contain atleast 3 characters");
    }
    else {
      this.dataService.onHideShowLoader(true);
      this.apiHandler.GetSearchedData(this.emailId, this.encryptedPassword, "", "", this.searchForm.value.search, this, [1, 2, 3]);
    }
  }

  onSuccess(response: any) {
    this.dataService.onHideShowLoader(false);
    this.searchedUsers = response;
    this.hideNoDataDiv = true;
    this.cdr.markForCheck();
  }
  onError(errorCode: number, errorMsg: string) {
    this.dataService.onHideShowLoader(false);
    this.searchedUsers = [];
    this.cdr.markForCheck();
    this.hideNoDataDiv = false;
    this.commonFunctions.showErrorSnackbar(errorMsg);
  }

  getName(item: any) {
    let name: string = "";
    switch (item.type) {
      case "agent":
        name = item.mName;
        break;
      case "Person":
        name = item.firstName + " " + item.lastName;
        break;
      case "Attorney":
        name = item.name1 + " " + item.name2;
        break;
      default:
        break;
    }

    return name;
  }

  getAddress(item: any) {
    let address: string = "";
    switch (item.type) {
      case "agent":
        address = item.mAddr1 + "," + item.mAddr2 + "," + item.mCity + "," + item.mState;
        break;
      case "Person":
        address = item.address1 + "," + item.address2 + "," + item.city + "," + item.county + "," + item.state;
        break;
      case "Attorney":
        address = item.addr1 + "," + item.addr2 + "," + item.city + "," + item.state;
        break;
      default:
        break;
    }

    return address + " " + item.zip;
  }


  private addValidation() {
    this.searchForm = new FormGroup({
      search: new FormControl(this.searchString, Validators.compose([Validators.required, Validators.minLength(3)])),

    });
  }
}
