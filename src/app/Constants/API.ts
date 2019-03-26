import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class API {
    SIDE_NAV_JSON = "../assets/jsons/sideNav.json";
    private API_BASE_URL = "https://compass.alliantnational.com:8118/do/action/WService=";

    getValidateCredentialUrl(username: string, password: string, app_mode: string) {
        return this.getBaseUrl(app_mode) + "I1=" + username + "&I2=" + password + "&I3=systemIdentity";
    }

    getForgotPasswordUrl(email: string, app_mode: string) {
        return this.getBaseUrl(app_mode) + "I3=systemEmailPassword&User=" + email;
    }

    getTopAgentsUrl(email: string, encryptedPassword: string, page_no: number, app_mode: string) {
        return this.getBaseUrl(app_mode) + "I1=" + email + "&I2=" + encryptedPassword + "&I3=topagentsget&PageNum=" + page_no + "&NoOfPages=5";
    }

    private getBaseUrl(app_mode: string) {
        return this.API_BASE_URL + app_mode + "/get?I0=JSON&I4=rcm&";
    }
}