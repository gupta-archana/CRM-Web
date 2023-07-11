import { AfterViewInit, Component, Injector, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BaseClass } from '../../../global/base-class';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { EntityModel } from '../../../models/entity-model';
import { SearchFilterModel } from '../../../models/search-filter-model';
import { MatDialog } from '@angular/material/dialog';
import { TagModel } from 'src/app/models/tag-model';
import { AddTagPopupComponent } from 'src/app/customUI/dialogs/add-tag/add-tag.component';


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
    hideNoDataDiv = false;
    emailId;
    encryptedPassword;
    searchString = "";
    searchFor = "All";
    public TOTAL_MATCH = "TotalMatch";
    public filterChanged = false;
    lastScrollPosition = 0;
    deviceInfo = null;
    totalRows: any = 0;
    pageNum = 0;
    moreDataAvailable = false;
    totalAndCurrentRowsRatio = "";
    filters: SearchFilterModel = null;
    shareDataSubscription: Subscription;

    selectedItemTagModel: Array<TagModel> = [];
  
    isEnableToSelectItem:boolean = false;
  
    isEnableToSelectAction:boolean = true;
    isEnableToTagAction:boolean = false;  
    isEnableToUnTagAction:boolean = false;

    constructor(injector: Injector,  private dialog: MatDialog) {
        super(injector);
    }

    ngOnInit() {
        this.addValidation();
        this.emailId = this.myLocalStorage.getValue(this.constants.EMAIL);
        this.encryptedPassword = this.commonFunctions.getEncryptedPassword(this.myLocalStorage.getValue(this.constants.PASSWORD));
        getData(this);
        getSearchFilter(this);
    // this.updateUI();
    }

    ngAfterViewInit(): void {
        getTagFromEntityTagList(this);
    }


    onSubmit() {
        if (!this.searchForm.valid) {
            this.commonFunctions.showErrorSnackbar("Search field must contain atleast 3 characters");
        } else {
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
        } else {
            this.makeServerRequest();
        }
    }

    public makeServerRequest() {
        this.pageNum++;
        this.dataService.onHideShowLoader(true);
        let selectedState = "All";
        let type = this.myLocalStorage.getValue(this.constants.SELECTED_SEARCH_IN);
        ({ selectedState, type } = this.setFilterForApiRequest(selectedState, type));

        let searchString: string = this.searchForm.value.search;
        searchString = searchString.replace(/#/g, '%23');
        searchString = searchString.replace(/,/g, '%2c');
        searchString = searchString.replace(/\s/g, '%2c');

        this.apiHandler.GetSearchedData(type, selectedState, searchString, this.pageNum, this);
    }

    public makeServerRequestForSelectedTag() {
        this.pageNum++;
        this.dataService.onHideShowLoader(true);
        let selectedState = "All";
        let type = this.myLocalStorage.getValue(this.constants.SELECTED_SEARCH_IN);
        ({ selectedState, type } = this.setFilterForApiRequest(selectedState, type));
        this.searchString = this.searchString.replace(/#/g, '%23');
        this.searchString = this.searchString.replace(/,/g, '%2c');
        this.searchString = this.searchString.replace(/\s/g, '%2c');

        this.apiHandler.GetSearchedData(type, selectedState, this.searchString, this.pageNum, this);
    }

    private setFilterForApiRequest(selectedState: string, type: string) {
        if (this.filters) {
            if (this.filters.selectedState) {
                selectedState = this.filters.selectedState;
            }
            const typeArray = [];
            if (this.filters.agentCheck) {
                typeArray.push(this.constants.ENTITY_AGENT_PRESENTER);
            }
            if (this.filters.peopleCheck) {
                typeArray.push(this.constants.ENTITY_PERSON_PRESENTER);
            }
            if (this.filters.employeeCheck) {
                typeArray.push(this.constants.ENTITY_EMPLOYEE_PRESENTER);
            }
            if (this.filters.allCheck) {
                typeArray.push(this.constants.ENTITY_ALL_PRESENTER);
            }
            if (typeArray && typeArray.length > 0) {
                type = typeArray.join(",");
            }
        }
        return { selectedState, type };
    }

    onSuccess(response: any) {
        this.onApiResponse(response.profile);

    }
    onError(errorCode: number, errorMsg: string) {
    // this.pageNum--;
        this.onApiResponse([]);
    // this.commonFunctions.showErrorSnackbar(errorMsg);
    }

    onApiResponse(newUsers: EntityModel[]) {
        this.dataService.onHideShowLoader(false);
        checkFilterChanged(this);
        if (newUsers && newUsers.length > 0) {
            newUsers.forEach(element => {
                if (element.type !== this.TOTAL_MATCH) {
                    this.commonFunctions.setFavoriteOnApisResponse(element);
                    this.searchedUsers.push(element);
                } else {
                    this.totalRows = element.rowNum;
                }
            });

        } else if (this.pageNum === 1) {
            this.totalRows = 0;
        }
        this.updateUI();
    }

    getAgentName(item: EntityModel){    
        if(item.agentNameList.split(',').length > 1){
          return item.agentNameList.split(',')[0] + '...';
        }
        else
          return item.agentNameList.split(',')[0];
    }

    getAddress(item: EntityModel) {
        return this.commonFunctions.getAddress(item);
    }

    onItemClick(item: EntityModel) {
        let navigatingPath = "";
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
        } else {
            this.commonFunctions.showErrorSnackbar("We are working on employee UI");
        }
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
        if (this.shareDataSubscription && !this.shareDataSubscription.closed) {
            this.shareDataSubscription.unsubscribe();
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
      this.isEnableToUnTagAction = (this.selectedItemTagModel.length > 0 && this.searchForm.value.search.startsWith("#"));  
    }
  
    isCheckMarkedItem(item){    
      let itemIndex = this.selectedItemTagModel.findIndex((tagModel)=> tagModel.entityID == item.entityId && tagModel.entity == item.type);
      return itemIndex >= 0 ? true : false;
    }
  
    onSelectAllClick(item){    
      this.selectedItemTagModel = [];
      this.isEnableToSelectAction = false;
      this.searchedUsers.forEach((item)=> {
        if(item.type !== 'E'){
            this.selectedItemTagModel.push(this.convertToTagModel(item));
        }        
      });   
      this.isEnableToSelectItem = true;
      this.isEnableToTagAction = true;
      this.isEnableToUnTagAction = (this.selectedItemTagModel.length > 0 && this.searchForm.value.search.startsWith("#"));     
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
          name: this.searchForm.value.search.startsWith('#') ? this.searchForm.value.search.slice(1) :  this.searchForm.value.search,
          private: "no"
        }
      
        return tagModel;
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
        if (!context.filters) {
            context.filters = new SearchFilterModel();
        }
        context.updateUI();
    }
}

function checkMoreDataAvailable(context: SearchComponent) {
    if ((!context.searchedUsers && context.searchedUsers.length === 0) || context.searchedUsers.length >= context.totalRows) {
        context.moreDataAvailable = false;
    } else {
        context.moreDataAvailable = true;
    }
}

function checkAndSetUi(context: SearchComponent) {
    if (!context.searchedUsers || context.searchedUsers.length === 0) {
        resetData(context);
    } else {
        context.hideNoDataDiv = true;
    }
    context.cdr.markForCheck();
}

function updateRatioUI(context: SearchComponent) {
    context.commonFunctions.showLoadedItemTagOnHeader(context.searchedUsers, context.totalRows);
    // context.totalAndCurrentRowsRatio = context.commonFunctions.showMoreDataSnackbar(context.searchedUsers, context.totalRows);
    context.cdr.markForCheck();
}

function getTagFromEntityTagList(context: SearchComponent) {
    context.shareDataSubscription = context.dataService.shareDataObservable.subscribe(tag => {
        if (tag) {
            context.searchString = tag;
            context.searchForm.get("search").setValue(context.searchString);
            context.makeServerRequestForSelectedTag();
            document.getElementById("searchButton").click();
            context.cdr.markForCheck();


        }
    });
}

function deleteTags(context: SearchComponent){  
    context.apiHandler.deleteTag(createJsonForDeleteTag(context), {
      onSuccess(response) {
        context.commonFunctions.showSnackbar("Tag" + " " + context.constants.DELETE_SUCCESS);     
        refreshData(context);                       
      }, onError(errorCode, errorMsg) {
        context.commonFunctions.showErrorSnackbar(errorMsg);
      }
    });   
}


function createJsonForDeleteTag(context:SearchComponent){
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



function refreshData(context: SearchComponent) {
    resetData(context);
    if (context.searchForm.valid) {
      context.makeServerRequest();
    }
  }