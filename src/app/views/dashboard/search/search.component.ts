import { Component, OnInit, Injector, OnDestroy, AfterViewInit, AfterContentInit, ViewEncapsulation, OnChanges, AfterContentChecked } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseClass } from '../../../global/base-class';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EntityModel } from '../../../models/entity-model';
import { CommonApisService } from '../../../utils/common-apis.service';
import { SearchFilterModel } from '../../../models/search-filter-model';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SearchComponent extends BaseClass implements OnInit, OnDestroy, AfterViewInit, ApiResponseCallback {

  searchFilterModelSub: Subscription = null;
  searchForm: FormGroup;
  searchedUsers: Array<EntityModel> = [];

  hideNoDataDiv: boolean = false;
  emailId;
  encryptedPassword;
  searchString: string = "";
  searchFor: string = "All";
  public TOTAL_MATCH: string = "TotalMatch";
  public filterChanged: boolean = false;
  lastScrollPosition = 0;
  deviceInfo = null;
  totalRows: any = 0;
  pageNum: number = 0;
  moreDataAvailable: boolean = false;
  totalAndCurrentRowsRatio: string = "";
  filters: SearchFilterModel = null;
  constructor(injector: Injector, private commonApis: CommonApisService) {
    super(injector);
  }

  ngOnInit() {
    this.addValidation();
  }

  ngAfterViewInit(): void {
    this.emailId = this.myLocalStorage.getValue(this.constants.EMAIL);
    this.encryptedPassword = this.commonFunctions.getEncryptedPassword(this.myLocalStorage.getValue(this.constants.PASSWORD));
    getData(this);

    checkAndSetUi(this);
    getSearchFilter(this);
    this.updateRatioUI();
    this.cdr.detectChanges();
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
    this.hitApi();
  }

  public hitApi() {
    if (!this.searchForm.valid) {
      this.commonFunctions.showErrorSnackbar("Search field must contain atleast 3 characters");
    }
    else {
      this.makeServerRequest();
    }
  }

  public makeServerRequest() {
    this.pageNum++;
    this.dataService.onHideShowLoader(true);
    let selectedState = "All";
    let type = "All";
    ({ selectedState, type } = this.setFilterForApiRequest(selectedState, type));
    this.apiHandler.GetSearchedData(type, selectedState, this.searchForm.value.search, this.pageNum, this);
  }

  private setFilterForApiRequest(selectedState: string, type: string) {
    if (this.filters) {
      if (this.filters.selectedState)
        selectedState = this.filters.selectedState;
      let typeArray = [];
      if (this.filters.agentCheck)
        typeArray.push(this.constants.ENTITY_AGENT_PRESENTER);
      if (this.filters.peopleCheck)
        typeArray.push(this.constants.ENTITY_PERSON_PRESENTER);
      if (this.filters.employeeCheck)
        typeArray.push(this.constants.ENTITY_EMPLOYEE_PRESENTER);
      if (this.filters.allCheck)
        typeArray.push(this.constants.ENTITY_ALL_PRESENTER);
      if (typeArray && typeArray.length > 0)
        type = typeArray.join(",");
    }
    return { selectedState, type };
  }

  onSuccess(response: any) {
    onApiResponse(response.profile, this);
    this.setData();
  }

  onError(errorCode: number, errorMsg: string) {
    onApiResponse([], this);
    this.commonFunctions.showErrorSnackbar(errorMsg);
  }

  getAddress(item: EntityModel) {
    let address: string = "";
    address = item.city + " " + item.state + " " + item.zip;
    return address;
  }

  onItemClick(item: EntityModel) {
    let navigatingPath: string = "";
    sessionStorage.setItem(this.constants.ENTITY_INFO, JSON.stringify(item));
    switch (item.type) {
      case this.constants.ENTITY_AGENT_PRESENTER:
        navigatingPath = this.paths.PATH_AGENT_DETAIL;

        break;
      case this.constants.ENTITY_PERSON_PRESENTER:
        navigatingPath = this.paths.PATH_PERSON_DETAIL;

        break;
      default:
        break;
    }
    if (navigatingPath) {
      this.setData();
      this.commonFunctions.navigateWithoutReplaceUrl(navigatingPath);
    }
    else
      this.commonFunctions.showErrorSnackbar("We are working on person ui");
  }


  private setData() {
    if (this.searchedUsers && this.searchedUsers.length > 0) {
      sessionStorage.setItem(this.constants.SEARCH_CURRENT_PAGE_NO, this.pageNum.toString());
      sessionStorage.setItem(this.constants.SEARCHED_ENTITY_ARRAY, JSON.stringify(this.searchedUsers));
      sessionStorage.setItem(this.constants.SEARCHED_STRING, this.searchForm.value.search);
      sessionStorage.setItem(this.constants.SEARCH_MORE_DATA_AVAILABLE_FLAG, JSON.stringify(this.moreDataAvailable));
      sessionStorage.setItem(this.constants.SEARCH_TOTAL_ROWS, this.totalRows);
    }

  }

  private addValidation() {
    this.searchForm = new FormGroup({
      search: new FormControl(this.searchString, Validators.compose([Validators.required, Validators.minLength(3)])),

    });
  }

  onStarClick(item: EntityModel, index: number) {
    this.commonApis.setFavorite(item, this.apiHandler, this.cdr).asObservable().subscribe(data => {
      this.setData();
    });
  }

  updateRatioUI() {
    this.totalAndCurrentRowsRatio = this.commonFunctions.showMoreDataSnackbar(this.searchedUsers, this.totalRows);
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    if (this.searchFilterModelSub && !this.searchFilterModelSub.closed) {
      this.searchFilterModelSub.unsubscribe();
    }
  }
}

function onApiResponse(newUsers: EntityModel[], context: SearchComponent) {
  context.dataService.onHideShowLoader(false);
  checkFilterChanged(context);
  if (newUsers) {
    newUsers.forEach(element => {
      if (element.type != context.TOTAL_MATCH) {
        context.searchedUsers.push(element);
      }
      else {
        context.totalRows = element.rowNum;
      }
    });

    checkMoreDataAvailable(context);
    context.updateRatioUI();
    context.cdr.markForCheck();
  }
}

function checkFilterChanged(context: SearchComponent) {
  if (context.filterChanged) {
    context.searchedUsers = [];
    context.filterChanged = false;
  }
}

function checkMoreDataAvailable(context: SearchComponent) {
  if (context.searchedUsers && context.searchedUsers.length > 0) {
    context.hideNoDataDiv = true;
  }
  else {
    context.hideNoDataDiv = false;
  }
  if (!context.searchedUsers || context.searchedUsers.length == context.totalRows)
    context.moreDataAvailable = false;
  else
    context.moreDataAvailable = true;
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
    context.filters = data;
    context.filterChanged = true;
    context.pageNum = 0;
    if (data && context.searchForm.valid) {
      context.hitApi();
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
    context.totalRows = Number(sessionStorage.getItem(context.constants.SEARCH_TOTAL_ROWS));
    context.searchForm.get("search").setValue(context.searchString);

    context.cdr.markForCheck();
  }
}
