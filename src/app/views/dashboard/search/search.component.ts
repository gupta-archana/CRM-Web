import { Component, OnInit, Injector } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseClass } from '../../../global/base-class';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SearchModel } from '../../../models/search-model';
import { DeviceDetectorService } from 'ngx-device-detector';


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
  searchString: string = "";
  searchFor: string = "All";
  pageNum: number = 0;
  moreDataAvailable: boolean = false;
  private AGENT: string = "Agent";
  private PERSON: string = "Person";
  deviceInfo = null;

  constructor(injector: Injector, private deviceService: DeviceDetectorService) {
    super(injector);
    this.epicFunction();

  }

  ngOnInit() {
    this.emailId = this.myLocalStorage.getValue(this.constants.EMAIL);
    this.encryptedPassword = this.commonFunctions.getEncryptedPassword(this.myLocalStorage.getValue(this.constants.PASSWORD));
    this.addValidation();
    getData(this);
    checkAndSetUi(this);
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

  onItemClick(item: SearchModel) {
    let navigatingPath: string = "";
    switch (item.type) {
      case this.AGENT:
        navigatingPath = this.paths.PATH_AGENT_DETAIL;
        sessionStorage.setItem(this.constants.AGENT_INFO, JSON.stringify(item));
        break;
      case this.PERSON:

        break;
      default:
        break;
    }
    if (navigatingPath)
      this.saveAndNavigate(navigatingPath);
    else
      this.commonFunctions.showErrorSnackbar("We are working on person ui");
  }


  private saveAndNavigate(navigatingPath: string) {
    sessionStorage.setItem(this.constants.SEARCH_CURRENT_PAGE_NO, this.pageNum.toString());
    sessionStorage.setItem(this.constants.SEARCHED_ENTITY_ARRAY, JSON.stringify(this.searchedUsers));
    sessionStorage.setItem(this.constants.SEARCHED_STRING, JSON.stringify(this.searchForm.value.search));
    sessionStorage.setItem(this.constants.SEARCH_MORE_DATA_AVAILABLE_FLAG, JSON.stringify(this.moreDataAvailable));
    this.commonFunctions.navigateWithoutReplaceUrl(navigatingPath);
  }

  private addValidation() {
    this.searchForm = new FormGroup({
      search: new FormControl(this.searchString, Validators.compose([Validators.required, Validators.minLength(3)])),

    });
  }
  epicFunction() {
    console.log('hello `Home` component');
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    console.log(this.deviceInfo);
    console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
    console.log(isTablet);  // returns if the device us a tablet (iPad etc)
    console.log(isDesktopDevice); // returns if the app is running on a Desktop browser.
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

function checkAndSetUi(context: SearchComponent) {
  if (!context.searchedUsers) {
    resetData(context);
  }
  else {
    context.hideNoDataDiv = true;
  }
  context.cdr.markForCheck();
}

function resetData(context: SearchComponent) {
  context.pageNum = 0;
  context.searchedUsers = [];
  context.hideNoDataDiv = false;
  context.moreDataAvailable = false;
}

function getData(context: SearchComponent) {
  context.searchedUsers = JSON.parse(sessionStorage.getItem(context.constants.SEARCHED_ENTITY_ARRAY));
  if (context.searchedUsers && context.searchedUsers.length > 0) {
    context.pageNum = Number(sessionStorage.getItem(context.constants.SEARCH_CURRENT_PAGE_NO));
    context.searchString = sessionStorage.getItem(context.constants.SEARCHED_STRING);
    context.moreDataAvailable = JSON.parse(sessionStorage.getItem(context.constants.SEARCH_MORE_DATA_AVAILABLE_FLAG));
    context.cdr.markForCheck();
  }


}
