import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class Constants {

    NO_INTERNET_CONNECTION_ERROR_CODE = 101;
    EMAIL = "email";
    PASSWORD = "password";
    REMEMBER_ME = "remeberMe";
    AGENT_INFO = "agentnfo";
    LOGOUT = "LOGOUT";
    LOGGED_IN = "logged_in";
    TOP_AGENT_CURRENT_PAGE_NO = "top_agent_page_no";
    TOP_AGENT_DATA = "top_agent_data";

    // Error Messages
    ERROR_NO_INTERNET_CONNECTON = "Kindly check your internet connection";
    ERROR_INVALID_EMAIL = "Please enter a valid email address";

    //Alert messages
    ALERT_LOGIUT_CONFIRMATION = "Are you sure want to exit from app?";

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

    // agent pages
    AGENT_DETAIL = "Agent Details";

}