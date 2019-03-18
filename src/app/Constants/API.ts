import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class API {
    SIDE_NAV_JSON = "../assets/jsons/sideNav.json";
    private API_BASE_URL = "https://compass.alliantnational.com:8118/do/action/WService=";

    getValidateCredentialUrl(username: string, password: string, app_mode: string) {
        return this.API_BASE_URL + app_mode + "/get?I0=JSON&I1=" + username + "&I2=" + password + "&I3=systemIdentity";
    }

    getForgotPasswordUrl(email: string, app_mode: string) {
        return this.API_BASE_URL + app_mode + "/get?I0=JSON&I3=systemEmailPassword&User=" + email;
    }
}