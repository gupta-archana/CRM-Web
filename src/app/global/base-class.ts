import { DataServiceService } from "../services/data-service.service";
import { CommonFunctionsService } from "../utils/common-functions.service";
import { Injector, ChangeDetectorRef } from "@angular/core";
import { MyLocalStorageService } from "../services/my-local-storage.service";
import * as paths from 'src/app/Constants/paths';
import { Constants } from "../Constants/Constants";
import { ApiHandlerService } from "../utils/api-handler.service";
import { OpenDialogsService } from "../utils/open-dialogs.service";
import { UtilService } from "../utils/util.service";
import { CommonApisService } from "../utils/common-apis.service";

export abstract class BaseClass {
    public dataService: DataServiceService;
    public commonFunctions: CommonFunctionsService;
    public myLocalStorage: MyLocalStorageService;
    public constants: Constants;
    public apiHandler: ApiHandlerService;
    public cdr: ChangeDetectorRef;
    public openDialogService: OpenDialogsService;
    public utils: UtilService;
    public paths: any = paths;
    public commonApis: CommonApisService;
    constructor(injector: Injector) {

        this.dataService = injector.get(DataServiceService);
        this.commonFunctions = injector.get(CommonFunctionsService);
        this.myLocalStorage = injector.get(MyLocalStorageService);
        this.constants = injector.get(Constants);
        this.apiHandler = injector.get(ApiHandlerService);
        this.cdr = injector.get(ChangeDetectorRef);
        this.openDialogService = injector.get(OpenDialogsService);
        this.utils = injector.get(UtilService);
        this.commonApis = injector.get(CommonApisService);

    }

    topFunction() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
    hideShowTopScrollButton() {
        const self = this;
        window.onscroll = function() {
            self.scrollFunction();
        };
    }
    private scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            document.getElementById("myBtn").style.display = "block";
        } else {
            document.getElementById("myBtn").style.display = "none";
        }
    }

}
