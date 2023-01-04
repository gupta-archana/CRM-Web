import { Injectable } from '@angular/core';
import * as paths from './paths';
@Injectable({
    providedIn: 'root'
})
export class Constants {

    NO_INTERNET_CONNECTION_ERROR_CODE = 101;
    EMAIL = "email";
    PASSWORD = "password";
    REMEMBER_ME = "rememberMe";
    LOGOUT_CONFIRMATION = "Logout Confirmation";
    ENTITY_INFO = "entityinfo";
    INTERNAL_ENTITY_MODEL = "internal_entitiy_model";
    LOGOUT = "Logout";
    CANCEL = "Cancel";
    LOGGED_IN = "logged_in";
    SELECTED_CLAIM = "selected_claim";
    SELECTED_ALERT = "selected_alert";
    SELECTED_AUDIT = "selected_audit";
    SELECTED_COMPLIANCE = "selected_compliance";
    DONT_SHOW_MARK_REVIED_DIALOG = "dont_show_mark_reviewed_dialog";
    DONT_SHOW_EMAIL_NOC_DIALOG = "dont_show_email_noc_dialog";
    DONT_SHOW_SEND_EMAIL_DIALOG = "dont_show_email_dialog";
    DONT_SHOW_DOWNLOAD_PDF_DIALOG = "dont_show_download_pdf_dialog";
    DONT_SHOW_ASSIGNED_TO_DIALOG = "dont_show_assigned_to_dialog";
    DONT_SHOW_DOWNLOAD_AUDIT_PDF_DIALOG = "dont_show_download_audit_pdf_dialog";

    // User config constants
    GOOGLE_NEWS_FEED = "Google";
    DEFAULT_NUMBER_FO_ROWS = 10;
    HOME_MODULE = "HomeModules";
    AGENT_MODULE = "AgentModules";
    PERSON_MODULE = "PersonModules";
    USER_NOTIFICATIONS_CONTROLS = "UserNotifications";

    ENTITY_ARRAY = "entity_array";

    LOGIN = "Login";

    NUMBER_OF_ROWS = "number_of_rows";
    SELECTED_HOME_SCREEN = "selected_home_screen";
    SELECTED_NEWS_FEED = "selected_news_feed";
    SELECTED_SEARCH_IN = "selected_search_in";

    AGENT_DETAIL_MENUES = "agent_detail_menues";
    SIDE_NAV_ITEMS = "side_nav_items";
    AGENT_DETAIL_ITEMS = "agent_detail_items";
    PERSON_DETAIL_ITEMS = "person_detail_items";
    SEARCH_FILTERS = "search_filters";
    SESSION_FAV_ARRAY = "session_fav_array";

    ENTITY_ALERTS_ENTITY_ID = "entity_alerts_entity_id";

    // top agents session constants
    TOP_AGENT_CURRENT_PAGE_NO = "top_agent_page_no";
    TOP_AGENT_DATA = "top_agent_data";
    TOP_AGENT_TOTAL_ROWS = "top_agent_total_rows";

    // search session constants
    SEARCHED_ENTITY_ARRAY = "searched_entntiy_array";
    SEARCH_CURRENT_PAGE_NO = "search_current_page_no";
    SEARCHED_STRING = "searched_string";
    SEARCH_MORE_DATA_AVAILABLE_FLAG = "search_more_data_available_flag";
    SEARCH_TOTAL_ROWS = "search_total_rows";

    // favorite session constants
    FAVORITE_ARRAY = "favorite_array";
    FAVORITE_PAGE_NUMBER = "favorite_page_num";
    FAVORITE_TOTAL_ROWS = "favorite_total_rows";

    // Agent performance session constants
    AGENT_PERFORMANCE_DATA = "agent_performance_data";
    AGENT_PERFORMANCE_CURRENT_PAGE_NO = "agent_performance_current_page_no";
    AGENT_PERFORMANCE_TOTAL_ROWS = "agent_performance_total_rows";

    // Agent under plan session constants
    AGENT_UNDER_PLAN_DATA = "agent_under_plan_data";
    AGENT_UNDER_PLAN_CURRENT_PAGE_NO = "agent_under_plan_current_page_no";
    AGENT_UNDER_PLAN_TOTAL_ROWS = "agent_under_plan_total_rows";

    // associates session constants
    ASSOCIATES_ARRAY = "associates_array";
    ASSOCIATES_PAGE_NUMBER = "associates_page_num";
    ASSOCIATES_TOTAL_ROWS = "associates_total_rows";
    ASSOCIATES_CURRENT_ENTITY_ID = "associates_current_entity_id";

    // Person session constants
    PERSONS_ENTITY_ARRAY = 'persons_entity_array';
    PERSONS_CURRENT_PAGE_NUMBER = 'persons_current_page_num';
    PERSONS_TOTAL_ROWS = 'persons_total_rows';
    PERSONS_SEARCHED_STRING = 'persons_searched_string';
    PERSONS_MORE_DATA_AVAILABLE_FLAG = 'persons_more_data_available_flag';

    // person agents session constants
    PERSON_AGENTS_ARRAY = "person_agents_array";
    PERSON_AGENTS_PAGE_NUMBER = "person_agents_page_num";
    PERSON_AGENTS_TOTAL_ROWS = "person_agents_total_rows";
    PERSON_AGENTS_CURRENT_ENTITY_ID = "person_agents_current_entity_id";

    // entity alert session constants
    ENTITY_ALERTS_ARRAY = "entity_alerts_array";
    ENTITY_ALERTS_PAGE_NUMBER = "entity_alerts_page_num";
    ENTITY_ALERTS_TOTAL_ROWS = "entity_alerts_total_rows";
    ENTITY_ALERTS_CURRENT_ENTITY_ID = "entity_alerts_current_entity_id";

    // entity claims session constants
    ENTITY_CLAIMS_ARRAY = "entity_claims_array";
    ENTITY_CLAIMS_PAGE_NUMBER = "entity_claims_page_num";
    ENTITY_CLAIMS_TOTAL_ROWS = "entity_claims_total_rows";
    ENTITY_CLAIMS_CURRENT_ENTITY_ID = "entity_claims_current_entity_id";


    // entity audits session contants
    ENTITY_AUDITS_ARRAY = "entity_audits_array";
    ENTITY_AUDITS_PAGE_NUMBER = "entity_audits_page_num";
    ENTITY_AUDITS_TOTAL_ROWS = "entity_audits_total_rows";
    ENTITY_AUDITS_CURRENT_ENTITY_ID = "entity_audits_current_entity_id";

    // agent compliance session contants
    AGENT_COMPLIANCE_ARRAY = "agent_compliance_array";
    AGENT_COMPLIANCE_CURRENT_ENTITY_ID = "agent_compliance_current_entity_id";

    // Error Messages
    ERROR_NO_INTERNET_CONNECTON = "Kindly check your internet connection";
    ERROR_INVALID_EMAIL = "Please enter a valid email address";
    ERROR_NO_DATA_AVAILABLE = "No Data Available";
    ERROR_NO_DATA_FOUND_FOR_SEARCH_CRITERIA = "No Data Available for the searched criteria";

    // Alert messages
    ALERT_LOGOUT_CONFIRMATION = "Do you want to logout from the Application";
    PASSWORD_SENT = "Password Sent";
    PASSWORD_SENT_ALERT_MSG = "Your Password has been sent to the registered email ID that you provided.";

    // SUCCESS MESSAGES
    UPDATe_SUCCESS = "has been updated successfully";
    CREATE_SUCCESS = "has been created successfully";
    DELETE_SUCCESS = "has been deleted successfully";


    // FALIURE MESSAGES
    UPDATED_FAIL = "Update Failed";
    CREATE_FAIL = "Creation Failed";
    DELETED_FAIL = "Deletion Failed";

    // LOGIN SCREEN MESSAGES

    LOGIN_SUCCESS = "Logged in Successfully";
    LOGOUT_SUCESS = "Logged out Successfully";

    // FAVORITE MESSAGES
    ADD_FAVORITE = "Marked as Favorite";
    REMOVE_FAVORITE = "Removed as Favorite";
    ACTION_FAILED = "Action failed";

    // Side Nav Drawer pages name
    TOP_AGENTS = "Top Agents";
    AGENTS_UNDER_PLAN = "Agents Under Plan";
    AGENTS_WITH_ALERT = "Agents with Alerts";
    AGENTS_WITH_PERFORMANCE = "Agents Performance";
    AGENT_UNDER_PLAN = "Agents Under Plan";
    NEWS = "News";
    ANNIVERSARY = "Anniversary";
    FAVOURITE = "Favourite";
    FOLLOWING = "Following";
    PERSONS = "Persons";
    SEARCH = "Search";
    RECENT_PROFILE = "Recent Profiles";
    SETTINGS = "Settings";
    NOTIFICATIONS = "Notifications";

    // Agnet Detail Menues
    AGENT_DETAIL_CONTACT = "Contact";
    AGENT_DETAIL_NOTES = "Notes";
    AGENT_DETAIL_ASSOCIATES = "Associates";
    AGENT_DETAIL_THIRTEEN_MONTH_ACTIVITY = "13 Month Activity";
    AGENT_DETAIL_OBJECTIVE = "Objective";
    AGENT_DETAIL_EVENTS = "Events";
    AGENT_DETAIL_TAGS = "Tags";
    AGENT_DETAIL_COMPLIANCE = "Compliance";
    AGENT_DETAIL_ALERTS = "Alerts";
    AGENT_DETAIL_CLAIMS = "Claims";
    AGENT_DETAIL_SOCIAL = "Social";
    AGENT_DETAIL_EMAILS = "E-mail";
    AGENT_DETAIL_AUDITS = "Audits";
    NO_DATA_AVAILABLE = "No Data Available";
    // agent pages
    AGENT_DETAIL = "Agent Details";
    PERSON_DETAIL = "Person Details";

    ENTITIY_ID_ALL = "ALL";
    ENTITY_TYPE_ALL = "ALL";

    // person detail menu
    PERSON_AGENT = "Agents";

    // Entities Type presenter
    ENTITY_AGENT_PRESENTER = "A";
    ENTITY_PERSON_PRESENTER = "P";
    ENTITY_EMPLOYEE_PRESENTER = "E";
    ENTITY_ALL_PRESENTER = "all";

    NOC_EMAIL_ID = "noc@alliantnational.com";

    public entityArrayObject = {
        Agent: this.ENTITY_AGENT_PRESENTER,
        Person: this.ENTITY_PERSON_PRESENTER,
        Employee: this.ENTITY_EMPLOYEE_PRESENTER
    };

    public sessionConstants =
        [this.TOP_AGENT_CURRENT_PAGE_NO,
            this.TOP_AGENT_DATA,
            this.TOP_AGENT_TOTAL_ROWS,
            this.SEARCHED_ENTITY_ARRAY,
            this.SEARCH_CURRENT_PAGE_NO,
            this.SEARCHED_STRING,
            this.SEARCH_MORE_DATA_AVAILABLE_FLAG,
            this.SEARCH_TOTAL_ROWS,
            this.FAVORITE_ARRAY,
            this.FAVORITE_PAGE_NUMBER,
            this.FAVORITE_TOTAL_ROWS,
            this.AGENT_PERFORMANCE_DATA,
            this.AGENT_PERFORMANCE_CURRENT_PAGE_NO,
            this.AGENT_PERFORMANCE_TOTAL_ROWS,
            this.AGENT_UNDER_PLAN_DATA,
            this.AGENT_UNDER_PLAN_CURRENT_PAGE_NO,
            this.AGENT_UNDER_PLAN_TOTAL_ROWS];

    public sideNavItemsWithPath = {
        "Search": paths.PATH_SEARCH,
        "Top Agents": paths.PATH_TOP_AGENTS,
        "Agent With Alert": paths.PATH_AGENTS_WITH_ALERT,
        "Agent With Performance": paths.PATH_AGENTS_WITH_PERFORMANCE,
        "Agent Under Plan": paths.PATH_AGENTS_UNDER_PLAN,
        "News": paths.PATH_NEWS,
        "Recent Profile": paths.PATH_RECENT_RPOFILES,
        "Following": paths.PATH_FOLLOWING,
    };
    public searchEntityArrayObjectUserConfig = {
        "ALL": "All",
        "Agents": this.ENTITY_AGENT_PRESENTER,
        "Person": this.ENTITY_PERSON_PRESENTER,
        "Employee": this.ENTITY_EMPLOYEE_PRESENTER
    };

    // app config constants
    HOME_SCREEN = "homescreen";
    SEARCH_FILTER = "searchfilter";
    BATCH_SIZE = "batchsize";
    NEWS_FEED = "newsfeed";

    // Statuses Array

    public statusFull =
        {
            c: 'Completed',
            a: "Active",
            x: 'Cancel'
        };


}
