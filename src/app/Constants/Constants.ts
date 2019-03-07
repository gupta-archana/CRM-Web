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
    ERROR_NO_DATA_ENTERED = "Please enter coverage amount";
    ERROR_OWNER_COVERAGE_AMOUNT = "Owner coverage amount cannot be left blank";
    ERROR_OWNER_RATE_TYPE = "Please select owner rate type";
    ERROR_LOAN_COVERAGE_AMOUNT = "Loan coverage amount cannot be left blank";
    ERROR_LOAN_RATE_TYPE = "Please select loan rate type";
    ERROR_LOAN_EFFECTIVE_DATE = "Please enter effective date";
    ERROR_SECOND_LOAN_COVERAGE_AMOUNT = "Second loan coverage amount cannot be left blank";
    ERROR_SECOND_LOAN_RATE_TYPE = "Please select second loan rate type";
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