import { AfterViewInit, Component, Injector, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BaseClass } from '../../../global/base-class';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { EntityModel } from '../../../models/entity-model';
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
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.addValidation();
    this.emailId = this.myLocalStorage.getValue(this.constants.EMAIL);
    this.encryptedPassword = this.commonFunctions.getEncryptedPassword(this.myLocalStorage.getValue(this.constants.PASSWORD));
    getData(this);
    getSearchFilter(this);
    this.updateUI();
  }

  ngAfterViewInit(): void {

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
    this.onApiResponse(response.profile);

  }

  onApiResponse(newUsers: EntityModel[]) {
    this.dataService.onHideShowLoader(false);
    checkFilterChanged(this);
    if (newUsers) {
      newUsers.forEach(element => {
        if (element.type != this.TOTAL_MATCH) {
          this.commonFunctions.setFavoriteOnApisResponse(element);
          this.searchedUsers.push(element);
        }
        else {
          this.totalRows = element.rowNum;
        }
      });

    }
    this.updateUI();
  }

  onError(errorCode: number, errorMsg: string) {
    this.onApiResponse([]);
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
      setData(this);
      this.commonFunctions.navigateWithoutReplaceUrl(navigatingPath);
    }
    else
      this.commonFunctions.showErrorSnackbar("We are working on person ui");
  }

  checkEntityFavorite(item: EntityModel) {
    return !this.commonFunctions.checkFavorite(item.entityId);
  }
  onStarClick(item: EntityModel, index: number) {
    this.commonApis.setFavorite(item, this.apiHandler, this.cdr).asObservable().subscribe(data => {
      this.updateUI();
    });
  }

  private addValidation() {
    this.searchForm = new FormGroup({
      search: new FormControl(this.searchString, Validators.compose([Validators.required, Validators.minLength(3)])),

    });
  }


  public updateUI() {
    setData(this);
    checkAndSetUi(this);
    checkMoreDataAvailable(this);
    updateRatioUI(this);
    this.cdr.markForCheck();
  }


  ngOnDestroy(): void {
    if (this.searchFilterModelSub && !this.searchFilterModelSub.closed) {
      this.searchFilterModelSub.unsubscribe();
    }
  }
}



function checkFilterChanged(context: SearchComponent) {
  if (context.filterChanged) {
    context.searchedUsers = [];
    context.filterChanged = false;
  }
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
  context.totalRows = 0;
  context.hideNoDataDiv = false;
  context.moreDataAvailable = false;
}

function setData(context: SearchComponent) {
  if (context.searchedUsers && context.searchedUsers.length > 0) {
    sessionStorage.setItem(context.constants.SEARCH_CURRENT_PAGE_NO, context.pageNum.toString());
    sessionStorage.setItem(context.constants.SEARCHED_ENTITY_ARRAY, JSON.stringify(context.searchedUsers));
    sessionStorage.setItem(context.constants.SEARCHED_STRING, context.searchForm.value.search);
    sessionStorage.setItem(context.constants.SEARCH_MORE_DATA_AVAILABLE_FLAG, JSON.stringify(context.moreDataAvailable));
    sessionStorage.setItem(context.constants.SEARCH_TOTAL_ROWS, context.totalRows);
  }

}

function getData(context: SearchComponent) {
  context.searchedUsers = JSON.parse(sessionStorage.getItem(context.constants.SEARCHED_ENTITY_ARRAY));
  if (context.searchedUsers && context.searchedUsers.length > 0) {
    context.pageNum = Number(sessionStorage.getItem(context.constants.SEARCH_CURRENT_PAGE_NO));
    context.searchString = sessionStorage.getItem(context.constants.SEARCHED_STRING);
    context.moreDataAvailable = JSON.parse(sessionStorage.getItem(context.constants.SEARCH_MORE_DATA_AVAILABLE_FLAG));
    context.totalRows = Number(sessionStorage.getItem(context.constants.SEARCH_TOTAL_ROWS));
    context.searchForm.get("search").setValue(context.searchString);
    context.filters = JSON.parse(sessionStorage.getItem(context.constants.SEARCH_FILTERS));
    if (!context.filters)
      context.filters = new SearchFilterModel();
    context.updateUI();
  }
}

function checkMoreDataAvailable(context: SearchComponent) {
  if ((!context.searchedUsers && context.searchedUsers.length == 0) || context.searchedUsers.length == context.totalRows)
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

function updateRatioUI(context: SearchComponent) {
  context.totalAndCurrentRowsRatio = context.commonFunctions.showMoreDataSnackbar(context.searchedUsers, context.totalRows);
  context.cdr.markForCheck();
}
