import { DataServiceService } from "../services/data-service.service";
import { CommonFunctionsService } from "../utils/common-functions.service";
import { Injector, ChangeDetectorRef } from "@angular/core";
import { MyLocalStorageService } from "../services/my-local-storage.service";
import * as paths from 'src/app/Constants/paths';
import { Constants } from "../Constants/Constants";
import { ApiHandlerService } from "../utils/api-handler.service";

export abstract class BaseClass {
    protected dataService: DataServiceService;
    protected commonFunctions: CommonFunctionsService;
    protected myLocalStorage: MyLocalStorageService;
    protected constants: Constants;
    protected apiHandler: ApiHandlerService;
    protected cdr: ChangeDetectorRef;
    protected paths: any = paths;
    constructor(injector: Injector) {

        this.dataService = injector.get(DataServiceService);
        this.commonFunctions = injector.get(CommonFunctionsService);
        this.myLocalStorage = injector.get(MyLocalStorageService);
        this.constants = injector.get(Constants);
        this.apiHandler = injector.get(ApiHandlerService);
        this.cdr = injector.get(ChangeDetectorRef);

    }

    topFunction() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
    hideShowTopScrollButton() {
        let self = this;
        window.onscroll = function () { self.scrollFunction() };
    }
    private scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            document.getElementById("myBtn").style.display = "block";
        } else {
            document.getElementById("myBtn").style.display = "none";
        }
    }

}
