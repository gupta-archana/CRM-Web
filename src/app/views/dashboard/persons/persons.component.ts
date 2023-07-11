import { Component, Injector, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { BaseClass } from 'src/app/global/base-class';
import { ApiResponseCallback } from 'src/app/Interfaces/ApiResponseCallback';
import { EntityContactModel } from 'src/app/models/entity-contact-model';
import { EntityModel } from 'src/app/models/entity-model';
import { MatDialog } from '@angular/material/dialog';
import { AddTagPopupComponent } from 'src/app/customUI/dialogs/add-tag/add-tag.component';
import { TagModel } from 'src/app/models/tag-model';

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
  
  selectedItemTagModel: Array<TagModel> = [];
  
  isEnableToSelectItem:boolean = false;

  isEnableToSelectAction:boolean = true;
  isEnableToTagAction:boolean = false;  
  isEnableToUnTagAction:boolean = false;

  constructor(injector: Injector, private dialog: MatDialog) {
    super(injector);
  }

  ngOnInit() {
    this.pageRefreshSubscription = this.dataService.pageRefreshObservable.subscribe(called => {
      if (called) {
        refreshData(this);
      }
    });    
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

  openAddTagDialog() {
    this.dialog.open(AddTagPopupComponent,{
      data: {
        message: JSON.stringify(this.selectedItemTagModel)
      }
    }).afterClosed().subscribe(response => {      
        if (response) {
            this.OnTagDialogClose(response);
        }
    });
  }

  OnTagDialogClose(message: string) {
    this.selectedItemTagModel = [];
    this.isEnableToSelectAction = true;
    this.isEnableToSelectItem = false;
    this.isEnableToTagAction = false;
    this.isEnableToUnTagAction = false;
    this.cdr.markForCheck();
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

  onSelectActionClick(){
    this.isEnableToSelectItem = !this.isEnableToSelectItem;    
    this.isEnableToSelectAction = !this.isEnableToSelectAction; 
    this.isEnableToTagAction = false;
    this.isEnableToUnTagAction = false;
    this.selectedItemTagModel = [];
  }

  onCheckMarkClick(item){    
    /*
    let itemIndex = this.selectedItems.findIndex((element)=> element.entityId == item.entityId);
    if(itemIndex === -1){
      this.selectedItems.push(item);
    } else if(itemIndex >= 0){
      this.selectedItems.splice(itemIndex, 1);      
    }     */

    let itemIndex = this.selectedItemTagModel.findIndex((tagModel)=> tagModel.entityID == item.entityId && tagModel.entity == item.type);    
    itemIndex === -1 ? this.selectedItemTagModel.push(this.convertToTagModel(item)) : itemIndex >= 0 ? this.selectedItemTagModel.splice(itemIndex, 1):'';    
    this.isEnableToTagAction = this.selectedItemTagModel.length > 0;  
    this.isEnableToUnTagAction = (this.selectedItemTagModel.length > 0 && this.searchForm.value.searchPerson.startsWith("#"));  
  }

  isCheckMarkedItem(item){    
    let itemIndex = this.selectedItemTagModel.findIndex((tagModel)=> tagModel.entityID == item.entityId && tagModel.entity == item.type);
    return itemIndex >= 0 ? true : false;
  }

  onSelectAllClick(item){    
    this.selectedItemTagModel = [];
    this.isEnableToSelectAction = false;
    this.searchedPersons.forEach((item)=> {
      this.selectedItemTagModel.push(this.convertToTagModel(item))
    });   
    this.isEnableToSelectItem = true;
    this.isEnableToTagAction = true;
    this.isEnableToUnTagAction = (this.selectedItemTagModel.length > 0 && this.searchForm.value.searchPerson.startsWith("#"));     
  }

  onDeselectAllClick(){
    this.selectedItemTagModel = [];
    this.isEnableToTagAction = false;
    this.isEnableToUnTagAction = false;
  }

  onUnTagActionClick(){
    deleteTags(this);
  }  

  convertToTagModel(item){
    const tagModel: TagModel = {
      tagID: '',
      entity: item.type,
      entityID: item.entityId,
      UID: this.myLocalStorage.getValue(this.constants.EMAIL),
      name: this.searchForm.value.searchPerson.startsWith('#') ? this.searchForm.value.searchPerson.slice(1) :  this.searchForm.value.searchPerson,
      private: "no"
    }
  
    return tagModel;
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

  context.selectedItemTagModel = [];
  context.isEnableToSelectAction = true;
  context.isEnableToSelectItem = false;
  context.isEnableToTagAction = false;
  context.isEnableToUnTagAction = false;  
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

function deleteTags(context: PersonsComponent){
  
  context.apiHandler.deleteTag(createJsonForDeleteTag(context), {
    onSuccess(response) {
      context.commonFunctions.showSnackbar("Tag" + " " + context.constants.DELETE_SUCCESS);     
      refreshData(context);                       
    }, onError(errorCode, errorMsg) {
      context.commonFunctions.showErrorSnackbar(errorMsg);
    }
  });   
}

function createJsonForDeleteTag(context:PersonsComponent){
  let finalJson = [];
  context.selectedItemTagModel.forEach((item) => {
    const itemJson = {
            "tag": "",
            "attr": item
    }        
    finalJson.push(itemJson);
  });

  return finalJson;
}
