import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseClass } from '../../../../global/base-class';
import { EntityModel } from '../../../../models/entity-model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-agents-profile',
    templateUrl: './agents-profile.component.html',
    styleUrls: ['./agents-profile.component.css']
})
export class AgentsProfileComponent extends BaseClass implements OnInit, OnDestroy {

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
        getData(this);
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
        this.commonFunctions.navigateWithoutReplaceUrl(this.paths.PATH_AGENT_DETAIL);
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
function refreshContent(context: AgentsProfileComponent) {
    context.pageRefreshSubscription = context.dataService.pageRefreshObservable.subscribe(called => {
        // if (called)
        getData(context);
    });
}

function getData(context: AgentsProfileComponent) {
    if (context.selectedIndex === 0) {
        context.recentProfileArray = JSON.parse(context.myLocalStorage.getValue(context.constants.ENTITY_ARRAY));
        if (context.recentProfileArray) {
            context.recentProfileArray = context.recentProfileArray.filter(t => t.type === 'A');
            setHeaderContent(context);
        }
    }
}
function tabSelectedIndexSubscription(context: AgentsProfileComponent) {
    context.tabIndexSubscription = context.dataService.tabSelectedObservable.subscribe((index: number) => {
        context.selectedIndex = index;
        if (index === 0) {
            if (context.recentProfileArray && context.recentProfileArray.length >= 1) {
                setHeaderContent(context);
            } else {
                getData(context);
            }
        }
    });
}

function setHeaderContent(context: AgentsProfileComponent) {
    context.commonFunctions.showLoadedItemTagOnHeader(context.recentProfileArray, context.recentProfileArray.length);
    checkAndSetUi(context);
}

function checkAndSetUi(context: AgentsProfileComponent) {
    if (!context.recentProfileArray || context.recentProfileArray.length === 0) {
        context.errorMsg = "No Agent profiles you visited yet";
        resetData(context);
    } else {

        context.hideNoDataDiv = true;
    }
    context.cdr.markForCheck();
}

function resetData(context: AgentsProfileComponent) {

    context.hideNoDataDiv = false;
}
