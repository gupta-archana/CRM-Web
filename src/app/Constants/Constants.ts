import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class Constants {

    NO_INTERNET_CONNECTION_ERROR_CODE = 101;
    EMAIL = "email";
    PASSWORD = "password";
    REMEMBER_ME = "remeberMe";
    // Error Messages
   
    ERROR_NO_INTERNET_CONNECTON = "Kindly check your internet connection";



    //Side Nav Drawer pages name
    TOP_AGENTS = "Top Agents";
    AGENTS_UNDER_PLAN = "Agents Under Plan";
    AGENTS_WITH_ALERT = "Agents with Alerts";
    AGENTS_WITH_PERFORMANCE = "Agents Performance";
    NEWS = "News";
    ANNIVERSARY = "Anniversary";
    FAVOURITE = "Favourite";
    SEARCH = "Search";
    RECENT_PROFILE = "Recent Profiles";

}