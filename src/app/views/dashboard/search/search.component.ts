import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseClass } from '../../../global/base-class';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EntityModel } from '../../../models/entity-model';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CommonApisService } from '../../../utils/common-apis.service';
import { SearchFilterModel } from '../../../models/search-filter-model';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent extends BaseClass implements OnInit, OnDestroy, ApiResponseCallback {


  searchFilterModelSub: Subscription = null;
  searchForm: FormGroup;
  searchedUsers: Array<EntityModel> = [];
  searchedUsersTempArray: Array<EntityModel> = [];
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

  constructor(injector: Injector, private deviceService: DeviceDetectorService, private commonApis: CommonApisService) {
    super(injector);
  }

  ngOnInit() {
    this.emailId = this.myLocalStorage.getValue(this.constants.EMAIL);
    this.encryptedPassword = this.commonFunctions.getEncryptedPassword(this.myLocalStorage.getValue(this.constants.PASSWORD));
    getData(this);
    this.addValidation();
    checkAndSetUi(this);
    getSearchFilter(this);
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
    this.apiHandler.GetSearchedData(this.searchFor, "All", this.searchForm.value.search, this.pageNum, this);
  }

  onSuccess(response: any) {
    onApiResponse(response.profile, this);
    this.saveSearchedData();
  }

  onError(errorCode: number, errorMsg: string) {
    onApiResponse([], this);
    this.commonFunctions.showErrorSnackbar(errorMsg);
  }

  getAddress(item: EntityModel) {
    let address: string = "";
    address = item.addr1 + " " + item.addr2 + " " + item.addr3 + " " + item.addr4 + " " + item.city + " " + item.state + " " + item.zip;
    return address;
  }

  onItemClick(item: EntityModel) {
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
    if (navigatingPath) {
      //this.saveSearchedData();
      this.commonFunctions.navigateWithoutReplaceUrl(navigatingPath);
    }
    else
      this.commonFunctions.showErrorSnackbar("We are working on person ui");
  }


  private saveSearchedData() {
    if (this.searchedUsers && this.searchedUsers.length > 0) {
      sessionStorage.setItem(this.constants.SEARCH_CURRENT_PAGE_NO, this.pageNum.toString());
      sessionStorage.setItem(this.constants.SEARCHED_ENTITY_ARRAY, JSON.stringify(this.searchedUsers));
      sessionStorage.setItem(this.constants.SEARCHED_STRING, this.searchForm.value.search);
      sessionStorage.setItem(this.constants.SEARCH_MORE_DATA_AVAILABLE_FLAG, JSON.stringify(this.moreDataAvailable));
    }

  }

  private addValidation() {
    this.searchForm = new FormGroup({
      search: new FormControl(this.searchString, Validators.compose([Validators.required, Validators.minLength(3)])),

    });
  }

  onStarClick(item: EntityModel) {
    this.commonApis.setFavorite(item, this.apiHandler, this.cdr);
  }

  ngOnDestroy(): void {
    if (this.searchFilterModelSub && !this.searchFilterModelSub.closed) {
      this.searchFilterModelSub.unsubscribe();
    }
  }
}

function onApiResponse(newUsers: any, context: SearchComponent) {
  context.dataService.onHideShowLoader(false);
  context.searchedUsersTempArray = context.searchedUsers.concat(newUsers);
  context.searchedUsers = context.searchedUsersTempArray;
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

function getSearchFilter(context: SearchComponent) {
  context.searchFilterModelSub = context.dataService.searchFiltersObservable.subscribe(data => {
    if (data) {
      filterData(context, data);
    }
  });
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

function filterData(context: SearchComponent, filters: SearchFilterModel) {
  let searchUser = context.searchedUsersTempArray;
  let typeArray = [];
  if (filters.allCheck) {
    searchUser = furtherFiltering(filters, searchUser);
  }
  else {
    searchUser = filterArrayAccordingToType(filters, typeArray, context, searchUser);
  }


}

function filterArrayAccordingToType(filters: SearchFilterModel, typeArray: any[], context: SearchComponent, searchUser: EntityModel[]) {
  if (filters.agentCheck)
    typeArray.push(context.constants.ENTITY_AGENT);
  if (filters.peopleCheck)
    typeArray.push(context.constants.ENTITY_PERSON);
  if (filters.employeeCheck)
    typeArray.push(context.constants.ENTITIY_EMPLOYEE);
  searchUser = sortDataTypeWise(searchUser, typeArray);
  searchUser = furtherFiltering(filters, searchUser);
  return searchUser;
}

function furtherFiltering(filters: SearchFilterModel, searchUser: EntityModel[]) {
  if (!filters.selectedState) {
    searchUser = sortArrayInGivenOrder(searchUser, filters.ascendingOrder);
  }
  else {
    searchUser = getEntitiesOfSelectedState(searchUser, filters.selectedState);
    searchUser = sortArrayInGivenOrder(searchUser, filters.ascendingOrder);
  }
  return searchUser;
}

function sortDataTypeWise(searchedUsers: Array<EntityModel>, typesArray: Array<string>) {
  let filterArray = [];
  searchedUsers.forEach(element => {
    if (typesArray.indexOf(element.type) != -1) {
      filterArray.push(element);
    }
  });
  return filterArray;
}


function getEntitiesOfSelectedState(searchDataArray: Array<EntityModel>, selectedState: string) {
  let filterArray = [];
  searchDataArray.forEach(element => {
    if (element.state.localeCompare(selectedState)) {
      filterArray.push(element);
    }
  });

  return filterArray;
}


function sortArrayInGivenOrder(searchDataArray: Array<EntityModel>, ascendingOrder: boolean) {
  if (ascendingOrder)
    return searchDataArray.sort(ascending);
  else
    return searchDataArray.sort(descending)
}

function ascending(a: EntityModel, b: EntityModel) {
  const genreA = a.name.toUpperCase();
  const genreB = b.name.toUpperCase();

  let comparison = 0;
  if (genreA > genreB) {
    comparison = 1;
  } else if (genreA < genreB) {
    comparison = -1;
  }
  return comparison;
}

function descending(a: EntityModel, b: EntityModel) {
  const genreA = a.name.toUpperCase();
  const genreB = b.name.toUpperCase();

  let comparison = 0;
  if (genreA > genreB) {
    comparison = 1;
  } else if (genreA < genreB) {
    comparison = -1;
  }
  return comparison * -1;
}
