import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { createBrowserHistory as createHistory } from 'history';
import { PlatformLocation, LocationStrategy } from '@angular/common';
import { CommonFunctionsService } from './common-functions.service';
import { RoutingStateService } from '../services/routing-state.service';
import * as paths from 'src/app/Constants/paths';
import { ApiHandlerService } from './api-handler.service';
import { DataServiceService } from '../services/data-service.service';
import { Constants } from '../Constants/Constants';
import { MyLocalStorageService } from '../services/my-local-storage.service';

@Injectable({
    providedIn: 'root'
})
export class UtilService {
    exit = false;
    called = false;
    functionCalled: any;
    unlisten: any;
    constructor(private location: PlatformLocation,
        private activeRoute: ActivatedRoute,
        private commonFunctions: CommonFunctionsService,
        private routingState: RoutingStateService,
        private router: Router,
        private apiHandler: ApiHandlerService,
        private dataService: DataServiceService,
        private constants: Constants,
        private myLocalStorage: MyLocalStorageService) { }

    handleBackpressEvent() {
        history.pushState(null, null, location.href);
        this.called = false;
        this.regsiterAndListenNavigationEvent();

    }

    private regsiterAndListenNavigationEvent() {
        const myHistory = createHistory();
        const self = this;

        this.unlisten = myHistory.listen((location, state) => {
            const newUrl = location.pathname.substring(1, this.location.pathname.length);
            const url = this.router.url.substring(1, this.router.url.length);
            if (newUrl === paths.PATH_AGENT_ASSOCIATES) {
                const customHistory = this.routingState.getHistory();
                for (let i = 0; i < customHistory.length - (customHistory.length - 2); i++) {
                    self.location.back();
                }
            } else if (paths.sideNavRoutePaths.indexOf(url) >= 0 && (newUrl === "" || paths.sideNavRoutePaths.indexOf(newUrl) >= 0)) {
                if (!self.called) {
                    self.called = true;
                    if (!self.exit) {
                        self.onFirstBackClick(self);
                    } else {
                        const customHistory = this.routingState.getAllHistory();
                        for (let i = 0; i <= customHistory.length; i++) {
                            self.location.back();
                        }
                    }
                } else {
                    self.called = false;
                }
            }
        });
    }

    removeBackpressEventListener() {
        if (this.unlisten) {
            this.unlisten();
        }

    }



    private onFirstBackClick(self: this) {
        self.exit = true;
        self.commonFunctions.showSnackbar("Press back again to exit");
        self.setDefault();
        history.go(1);
    }

    private setDefault() {
        setTimeout(() => {
            this.called = false;
            this.exit = false;
        }, 5000);
    }
    getSideNavItems() {
        const sideNavItems = JSON.parse(this.myLocalStorage.getValue(this.constants.SIDE_NAV_ITEMS));
        const self = this;
        if (!sideNavItems) {
            this.apiHandler.getSideNavJson({
                onSuccess(success) {
                    self.myLocalStorage.setValue(self.constants.SIDE_NAV_ITEMS, JSON.stringify(success));
                    self.dataService.sendSideNavData(success);
                }, onError(errCode, errMsg) {
                }
            });
        } else {
            this.dataService.sendSideNavData(sideNavItems);
        }

        return this.dataService.sideNavItemsSubjectObservable;
    }

    getAgentDetailItems() {
        const agnetDetailItems = JSON.parse(this.myLocalStorage.getValue(this.constants.AGENT_DETAIL_ITEMS));

        const self = this;
        if (!agnetDetailItems || agnetDetailItems.length === 0) {
            this.apiHandler.getAgentDetailMenus({
                onSuccess(success) {
                    self.myLocalStorage.setValue(self.constants.AGENT_DETAIL_ITEMS, JSON.stringify(success));
                    self.dataService.sendAgentDetailItems(success);
                }, onError(errCode, errMsg) {
                }
            });
        } else {
            this.dataService.sendAgentDetailItems(agnetDetailItems);
        }

        return this.dataService.agentDetailItemsObservable;
    }

    getPersonDetailItems() {
        const personDetailItems = JSON.parse(this.myLocalStorage.getValue(this.constants.PERSON_DETAIL_ITEMS));

        const self = this;
        if (!personDetailItems || personDetailItems.length === 0) {
            this.apiHandler.getPersonDetailMenus({
                onSuccess(success) {
                    self.myLocalStorage.setValue(self.constants.PERSON_DETAIL_ITEMS, JSON.stringify(success));
                    self.dataService.sendPersonDetailItems(success);
                }, onError(errCode, errMsg) {
                }
            });
        } else {
            this.dataService.sendPersonDetailItems(personDetailItems);
        }

        return this.dataService.personDetailItemsObservable;
    }
}


