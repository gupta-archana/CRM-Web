import { HttpClient } from "@angular/common/http";
import { Component, Injector, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ApiResponseCallback } from "src/app/Interfaces/ApiResponseCallback";
import { BaseClass } from "src/app/global/base-class";

@Component({
    selector: "app-config-server",
    templateUrl: "./config-server.component.html",
    styleUrls: ["./config-server.component.css"],
})
export class ConfigServerComponent extends BaseClass implements OnInit, ApiResponseCallback {
    configServerForm: FormGroup; 
    fullURL:string = '';   
    constructor(private injector: Injector, private http: HttpClient) {
        super(injector);
    }
    onSuccess(response: any) {
        this.dataService.onHideShowLoader(false);
        this.myLocalStorage.setValue(this.constants.SERVER_URL, this.configServerForm.value.url);
        this.commonFunctions.showSnackbar("Server URL Configured");        
        this.commonFunctions.navigateWithReplaceUrl(this.paths.PATH_LOGIN);
    }
    onError(errorCode: number, errorMsg: string) {
        this.dataService.onHideShowLoader(false);
        this.commonFunctions.showErrorSnackbar("Invalid Server URL"); 
    }

    ngOnInit(): void {
        this.addValidation();
        this.setValueInFormControls();
    }

    onSubmit() {
        /*
        this.commonFunctions.printLog(this.configServerForm.value.url, true); 
        if (!this.configServerForm.valid) {       
            this.commonFunctions.showErrorSnackbar("Invalid");
        } else {
            this.dataService.onHideShowLoader(true);
            this.apiHandler.validateURL(this.configServerForm.value.url, this);
        }       

        this.http.get(this.configServerForm.value.url, { observe: 'response' }).subscribe(res => {
            console.log(res.status)
        })
        this.dataService.onHideShowLoader(true);   */


        if (!this.configServerForm.valid) {       
            this.commonFunctions.showErrorSnackbar("Invalid URL");
        } else {
           /* this.dataService.onHideShowLoader(true);
            this.apiHandler.validateURL(this.configServerForm.value.url, this); */
            this.dataService.onHideShowLoader(false);
            
            if(!this.configServerForm.value.url.startsWith('https:')){                
                this.fullURL = 'https://' + this.configServerForm.value.url;
            }
            else {
                this.fullURL = this.configServerForm.value.url;
            }

            try{
                let url = new URL(this.fullURL);
                const appName = url.hostname.toLowerCase().includes('alfa') ? "alfa" : url.hostname.toLowerCase().includes('beta') ? "beta" : "live";

                if(!url.protocol.startsWith('http')){
                    this.commonFunctions.showErrorSnackbar("Invalid URL Protocol");
                    return; 
                }
                else {
                    url.protocol = 'https://';
                }
                if(url.port && !url.port.startsWith('8118')){
                    this.commonFunctions.showErrorSnackbar("Invalid URL Port Number");
                    return;    
                }
                else{
                    url.port = '8118';
                }

                if(url.pathname && url.pathname.length > 1 && !url.pathname.startsWith('/do/action/WService=' + appName)){
                    this.commonFunctions.showErrorSnackbar("Invalid URL Path Name");
                    return;   
                }
                else{
                    url.pathname = '/do/action/WService=' + appName;
                }

                this.fullURL = url.href;
            }
            catch{
                this.commonFunctions.showErrorSnackbar("Invalid URL");
                return;
            }

            this.myLocalStorage.setValue(this.constants.SERVER_URL, this.fullURL);
            this.commonFunctions.showSnackbar("Server URL Configured");        
            this.commonFunctions.navigateWithReplaceUrl(this.paths.PATH_LOGIN);             
        }              
    }

    private addValidation() {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        //const re = /https:\/\/compassalfa\.alliantnational\.com:8118\/do\/action\/WService=alfa, https:\/\/compassbeta\.alliantnational\.com:8118\/do\/action\/WService=beta/i$;
        //const re = /^https:\/\/compass(|alfa|beta).alliantnational.com:8118\/do\/action\/WService=(alfa|beta|live)$;
        this.configServerForm = new FormGroup({
          //url: new FormControl('', Validators.compose([Validators.required, Validators.pattern(re)])),         
          url: new FormControl('', Validators.compose([Validators.required]))
        });
    }

    private setValueInFormControls(){
        if(this.myLocalStorage.getValue(this.constants.SERVER_URL)) {
            const url = new URL(this.myLocalStorage.getValue(this.constants.SERVER_URL));
            this.configServerForm.get('url').setValue(url.hostname);           
        }
    }
}
