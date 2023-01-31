import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseClass } from '../../../../global/base-class';
import { EntityModel } from '../../../../models/entity-model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-persons-profile',
    templateUrl: './persons-profile.component.html',
    styleUrls: ['./persons-profile.component.css']
})
export class PersonsProfileComponent extends BaseClass implements OnInit, OnDestroy {

    recentProfileArray: Array<EntityModel> = [];
    pageRefreshSubscription: Subscription = null;
    tabIndexSubscription: Subscription = null;
    selectedIndex = -1;
    hideNoDataDiv = false;
    errorMsg = "";
    constructor(private injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        refreshContent(this);
        tabSelectedIndexSubscription(this);
    }

    checkEntityFavorite(item: EntityModel) {
        return !this.commonFunctions.checkFavorite(item.entityId);
    }

    getAddress(item: EntityModel) {
        return this.commonFunctions.getAddress(item);
    }

    onItemClick(item: EntityModel) {
        sessionStorage.setItem(this.constants.ENTITY_INFO, JSON.stringify(item));
        this.commonFunctions.navigateWithoutReplaceUrl(this.paths.PATH_PERSON_DETAIL);
    }
    onStarClick(item: EntityModel) {
        this.commonApis.setFavorite(item, this.apiHandler, this.cdr).asObservable().subscribe(data => {
            getData(this);
        });
    }

    ngOnDestroy(): void {
        if (this.pageRefreshSubscription && !this.pageRefreshSubscription.closed) {
            this.pageRefreshSubscription.unsubscribe();
        }
        if (this.tabIndexSubscription && !this.tabIndexSubscription.closed) {
            this.tabIndexSubscription.unsubscribe();
        }
    }
}

function refreshContent(context: PersonsProfileComponent) {
    context.pageRefreshSubscription = context.dataService.pageRefreshObservable.subscribe(called => {
        // if (called)
        getData(context);
    });
}

function getData(context: PersonsProfileComponent) {
    if (context.selectedIndex === 1) {
        context.recentProfileArray = JSON.parse(context.myLocalStorage.getValue(context.constants.ENTITY_ARRAY));
        if (context.recentProfileArray) {
            context.recentProfileArray = context.recentProfileArray.filter(t => t.type === 'P');
            setHeaderContent(context);
        }
    }
}
function tabSelectedIndexSubscription(context: PersonsProfileComponent) {
    context.tabIndexSubscription = context.dataService.tabSelectedObservable.subscribe((index: number) => {
        context.selectedIndex = index;
        if (index === 1) {
            if (context.recentProfileArray && context.recentProfileArray.length >= 1) {
                setHeaderContent(context);
            } else {
                getData(context);
            }
        }
    });
}

function setHeaderContent(context: PersonsProfileComponent) {
    context.commonFunctions.showLoadedItemTagOnHeader(context.recentProfileArray, context.recentProfileArray.length);
    checkAndSetUi(context);
}

function checkAndSetUi(context: PersonsProfileComponent) {
    if (!context.recentProfileArray || context.recentProfileArray.length === 0) {
        context.errorMsg = "No person profiles you visited yet";
        resetData(context);
    } else {

        context.hideNoDataDiv = true;
    }
    context.cdr.markForCheck();
}

function resetData(context: PersonsProfileComponent) {

    context.hideNoDataDiv = false;
}
