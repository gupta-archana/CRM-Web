import { DataServiceService } from "../services/data-service.service";
import { CommonFunctionsService } from "../utils/common-functions.service";
import { Injector, Inject, OnInit } from "@angular/core";
import { Subject } from "rxjs";


let appInjectorRef: Injector;

export const appInjector = (injector?: Injector): Injector => {

    if (injector) {
        appInjectorRef = injector;
    }

    return appInjectorRef;
};

export abstract class BaseClass {


    dataService: DataServiceService;
    commonFunctions: CommonFunctionsService;
    constructor(private injector: Injector) {
        this.dataService = injector.get(DataServiceService);
        this.commonFunctions = injector.get(CommonFunctionsService);

    }

}
