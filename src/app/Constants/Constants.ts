import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class Constants {

  NO_INTERNET_CONNECTION_ERROR_CODE = 101;
  EMAIL = "email";
  PASSWORD = "password";
  REMEMBER_ME = "remeberMe";
  LOGOUT_CONFIRMATION = "Logout Confirmation";
  AGENT_INFO = "agentnfo";
  LOGOUT = "Logout";
  CANCEL = "Cancel";
  LOGGED_IN = "logged_in";
  TOP_AGENT_CURRENT_PAGE_NO = "top_agent_page_no";
  TOP_AGENT_DATA = "top_agent_data";
  NUMBER_OF_ROWS = "number_of_rows";
  ENTITY_ARRAY = "entity_array";
  SEARCHED_ENTITY_ARRAY = "searched_entntiy_array";
  SEARCH_CURRENT_PAGE_NO = "search_current_page_no";
  SEARCHED_STRING = "searched_string";
  SEARCH_MORE_DATA_AVAILABLE_FLAG = "search_more_data_available_flag";
  LOGIN = "Login";
  TOP_AGENT_TOTAL_ROWS = "top_agent_total_rows";
  AGENT_DETAIL_MENUES = "agent_detail_menues";
  SIDE_NAV_ITEMS = "side_nav_items";

  // Error Messages
  ERROR_NO_INTERNET_CONNECTON = "Kindly check your internet connection";
  ERROR_INVALID_EMAIL = "Please enter a valid email address";
  ERROR_NO_DATA_AVAILABLE = "No Data Available";
  ERROR_NO_DATA_FOUND_FOR_SEARCH_CRITERIA = "No Data Available for the searched criteria";

  //Alert messages
  ALERT_LOGOUT_CONFIRMATION = "Do you want to logout from the Application";
  PASSWORD_SENT = "Password Sent";
  PASSWORD_SENT_ALERT_MSG = "Your Password has been sent to the registered email ID that you provided.";

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
  SETTINGS = "Settings";

  //Agnet Detail Menues
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

  // agent pages
  AGENT_DETAIL = "Agent Details";

}
