import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BaseClass } from 'src/app/global/base-class';
import { ApiResponseCallback } from 'src/app/Interfaces/ApiResponseCallback';
import { EntityContactModel } from 'src/app/models/entity-contact-model';
import { EntityModel } from 'src/app/models/entity-model';


@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.css']
})
export class PersonsComponent extends BaseClass implements OnInit, ApiResponseCallback {
  searchForm: FormGroup;
  searchString: any = "";
  searchedPersons: any = "";
  pageNumber: number = 0;
  moreDataAvailable: any;
  totalRows: any;
  hideNoDataDiv: boolean = false;
  entityContactModel: EntityContactModel = new EntityContactModel();
  public TOTAL_MATCH = "TotalMatch";
  pageRefreshSubscription: Subscription = null;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.pageRefreshSubscription = this.dataService.pageRefreshObservable.subscribe(called => {
      if (called) {
        refreshData(this);
      }
    })
    this.addValidation();
    getData(this);
  }

  ngOnDestroy() {
    if (this.pageRefreshSubscription && !this.pageRefreshSubscription.closed) {
      this.pageRefreshSubscription.unsubscribe();
    }
  }

  onSubmit() {
    if (!this.searchForm.valid) {
      this.commonFunctions.showErrorSnackbar("Search field must contain atleast 3 characters");
    } else {
      resetData(this);
      makeServerRequest(this);
    }
  }

  private addValidation() {
    this.searchForm = new FormGroup({
      searchPerson: new FormControl(this.searchString, Validators.compose([Validators.required, Validators.minLength(3)])),
    });
  }

  onAddNewClick() {
    this.dataService.onAgentProfileEditClick(this.entityContactModel);
  }


  public updateUI() {
    setData(this);
    checkAndSetUi(this);
    checkMoreDataAvailable(this);
    updateRatioUI(this);
    this.cdr.markForCheck();
  }

  onSuccess(response: any) {
    this.onApiResponse(response.profile);

  }
  onError(errorCode: number, errorMsg: string) {
    // this.pageNum--;
    this.onApiResponse([]);
    // this.commonFunctions.showErrorSnackbar(errorMsg);
  }

  onApiResponse(newPersons: EntityModel[]) {
    this.dataService.onHideShowLoader(false);

    if (newPersons && newPersons.length > 0) {
      newPersons.forEach(element => {
        if (element.type !== this.TOTAL_MATCH) {
          this.commonFunctions.setFavoriteOnApisResponse(element);
          this.searchedPersons.push(element);
        } else {
          this.totalRows = element.rowNum;
        }
      });

    } else if (this.pageNumber === 1) {
      this.totalRows = 0;
    }
    this.updateUI();
  }

  getAddress(item: EntityModel) {
    return this.commonFunctions.getAddress(item);
  }

  getAgentName(item: EntityModel){   
    if(!item.agentNameList) return '';
    if(item.agentNameList.split(',').length > 1){
        return item.agentNameList.split(',')[0] + '...';
      }
      else
        return item.agentNameList.split(',')[0];
  }

  checkEntityFavorite(item: EntityModel) {
    return !this.commonFunctions.checkFavorite(item.entityId);
  }

  onStarClick(item: EntityModel, index: number) {
    this.commonApis.setFavorite(item, this.apiHandler, this.cdr).asObservable().subscribe(data => {
      this.updateUI();
    });
  }

  onLoadMoreClick() {
    this.hitApi();
  }

  public hitApi() {
    if (!this.searchForm.valid) {
      this.commonFunctions.showErrorSnackbar("Search field must contain atleast 3 characters");
    } else {
      makeServerRequest(this);
    }
  }

  onItemClick(item: EntityModel) {
    let navigatingPath = "";
    sessionStorage.setItem(this.constants.ENTITY_INFO, JSON.stringify(item));
    if (item.type == this.constants.ENTITY_PERSON_PRESENTER) {
      navigatingPath = this.paths.PATH_PERSON_DETAIL;
    }

    if (navigatingPath) {
      setData(this);
      this.commonFunctions.navigateWithoutReplaceUrl(navigatingPath);
    } else {
      this.commonFunctions.showErrorSnackbar("Invalid Selection");
    }
  }

  onAddPersonClick(){

  }

}

function getData(context: PersonsComponent) {
  context.searchedPersons = JSON.parse(sessionStorage.getItem(context.constants.PERSONS_ENTITY_ARRAY));
  if (context.searchedPersons && context.searchedPersons.length > 0) {
    context.pageNumber = Number(sessionStorage.getItem(context.constants.PERSONS_CURRENT_PAGE_NUMBER));
    context.searchString = sessionStorage.getItem(context.constants.PERSONS_SEARCHED_STRING);
    context.moreDataAvailable = JSON.parse(sessionStorage.getItem(context.constants.PERSONS_MORE_DATA_AVAILABLE_FLAG));
    context.totalRows = Number(sessionStorage.getItem(context.constants.PERSONS_TOTAL_ROWS));
    context.searchForm.get("searchPerson").setValue(context.searchString);

    context.updateUI();
  }
}


function setData(context: PersonsComponent) {
  if (context.searchedPersons && context.searchedPersons.length > 0) {
    sessionStorage.setItem(context.constants.PERSONS_CURRENT_PAGE_NUMBER, context.pageNumber.toString());
    sessionStorage.setItem(context.constants.PERSONS_ENTITY_ARRAY, JSON.stringify(context.searchedPersons));
    sessionStorage.setItem(context.constants.PERSONS_SEARCHED_STRING, context.searchForm.value.searchPerson);
    sessionStorage.setItem(context.constants.PERSONS_MORE_DATA_AVAILABLE_FLAG, JSON.stringify(context.moreDataAvailable));
    sessionStorage.setItem(context.constants.PERSONS_TOTAL_ROWS, context.totalRows.toString());
  }
}

function checkAndSetUi(context: PersonsComponent) {
  if (!context.searchedPersons || context.searchedPersons.length === 0) {
    resetData(context);
  } else {
    context.hideNoDataDiv = true;
  }
  context.cdr.markForCheck();
}

function resetData(context: PersonsComponent) {
  context.pageNumber = 0;
  context.searchedPersons = [];
  context.totalRows = 0;
  context.hideNoDataDiv = false;
  context.moreDataAvailable = false;
}

function checkMoreDataAvailable(context: PersonsComponent) {
  if ((!context.searchedPersons && context.searchedPersons.length === 0) || context.searchedPersons.length >= context.totalRows) {
    context.moreDataAvailable = false;
  } else {
    context.moreDataAvailable = true;
  }
}

function updateRatioUI(context: PersonsComponent) {
  context.commonFunctions.showLoadedItemTagOnHeader(context.searchedPersons, context.totalRows);
  // context.totalAndCurrentRowsRatio = context.commonFunctions.showMoreDataSnackbar(context.searchedUsers, context.totalRows);
  context.cdr.markForCheck();
}

function refreshData(context: PersonsComponent) {
  resetData(context);
  if (context.searchForm.valid) {
    makeServerRequest(context);
  }
}

function makeServerRequest(context: PersonsComponent) {
  context.pageNumber++;
  context.dataService.onHideShowLoader(true);

  const selectedState = "ALL";  /* ALL State */
  const type = context.constants.ENTITY_PERSON_PRESENTER;

  let searchString: string = context.searchForm.value.searchPerson;
  searchString = searchString.replace(/#/g, '%23');
  searchString = searchString.replace(/,/g, '%2c');
  searchString = searchString.replace(/\s/g, '%2c');

  context.apiHandler.GetSearchedData(type, selectedState, searchString, context.pageNumber, context);
}