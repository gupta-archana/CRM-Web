import { Component, OnInit, Injector } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseClass } from '../../../global/base-class';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SearchModel } from '../../../models/search-model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent extends BaseClass implements OnInit, ApiResponseCallback {

  filterSubscription: Subscription = null;
  searchForm: FormGroup;
  searchedUsers: Array<SearchModel> = [];
  hideNoDataDiv: boolean = false;
  emailId;
  encryptedPassword;
  searchString: string = "Dav";
  searchFor: string = "All";
  pageNum: number = 0;
  moreDataAvailable: boolean = false;
  constructor(injector: Injector) {
    super(injector);
    resetData(this);
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
      resetData(this);
      this.makeServerRequest();
    }
  }

  onLoadMoreClick() {
    this.makeServerRequest();
  }

  private makeServerRequest() {
    this.pageNum++;
    this.dataService.onHideShowLoader(true);
    this.apiHandler.GetSearchedData(this.emailId, this.encryptedPassword, this.searchFor, "All", this.searchForm.value.search, this.pageNum, this);
  }

  onSuccess(response: any) {
    onApiResponse(response.ttresult, true, this);
  }

  onError(errorCode: number, errorMsg: string) {
    onApiResponse([], false, this);
    this.commonFunctions.showErrorSnackbar(errorMsg);
  }

  getAddress(item: SearchModel) {
    let address: string = "";
    address = item.addr1 + " " + item.addr2 + " " + item.addr3 + " " + item.addr4 + " " + item.city + " " + item.state + " " + item.zip;
    return address;
  }


  private addValidation() {
    this.searchForm = new FormGroup({
      search: new FormControl(this.searchString, Validators.compose([Validators.required, Validators.minLength(3)])),

    });
  }
}

function onApiResponse(newUsers: any, hideNoDataDiv: boolean, context: SearchComponent) {
  context.dataService.onHideShowLoader(false);
  context.searchedUsers = context.searchedUsers.concat(newUsers);
  if (context.searchedUsers && context.searchedUsers.length > 0) {
    context.hideNoDataDiv = true;
  } else {
    context.hideNoDataDiv = false;
  }
  if (!newUsers || newUsers.length == 0)
    context.moreDataAvailable = false;
  else
    context.moreDataAvailable = true;
  context.cdr.markForCheck();
}

function resetData(context: SearchComponent) {
  context.pageNum = 0;
  context.searchedUsers = [];
  context.hideNoDataDiv = false;
  context.moreDataAvailable = false;
  context.cdr.markForCheck();
}