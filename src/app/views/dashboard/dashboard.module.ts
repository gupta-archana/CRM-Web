import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationDrawerComponent } from './navigation-drawer/navigation-drawer.component';
import { TopAgentsComponent } from './top-agents/top-agents.component';
import { RouterModule } from '@angular/router';
import { dashboardRoutes } from './dashboard.routes';
import { AuthGuardService } from '../../guards/auth-guard.service';
import { AgentWithAlertComponent } from './agent-with-alert/agent-with-alert.component';
import { AgentWithPerformanceComponent } from './agent-with-performance/agent-with-performance.component';
import { CanDeactivateGuard } from "../../guards/can-deactivate/can-deactivate.guard";
import { SearchComponent } from './search/search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NewsFeedsComponent } from './news-feeds/news-feeds.component';
import { TabComponent } from './ProfileAndSetting/tab/tab.component';
import { ProfileSettingComponent } from './ProfileAndSetting/profile-setting/profile-setting.component';
import { AppSettingComponent } from './ProfileAndSetting/app-setting/app-setting.component';
import { ModulesModule } from '../../shared/modules/modules.module';
import { RecentProfilesComponent } from './recent-profiles/recent-profiles.component';
import { AgentsProfileComponent } from './recent-profiles/agents-profile/agents-profile.component';
import { PersonsProfileComponent } from './recent-profiles/persons-profile/persons-profile.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { AgentUnderPlanComponent } from './agent-under-plan/agent-under-plan.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ChangePasswordComponent } from '../../customUI/dialogs/change-password/change-password.component';
import { NotificationsNewComponent } from './notifications/notifications-new/notifications-new.component';
import { NotificationsDismissedComponent } from './notifications/notifications-dismissed/notifications-dismissed.component';
import { PersonsComponent } from './persons/persons.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(dashboardRoutes),
        FormsModule, ReactiveFormsModule, ModulesModule

    ],
    providers: [AuthGuardService, CanDeactivateGuard],
    declarations: [NavigationDrawerComponent, TopAgentsComponent, AgentWithAlertComponent, AgentWithPerformanceComponent, SearchComponent, NewsFeedsComponent, TabComponent, ProfileSettingComponent, AppSettingComponent, RecentProfilesComponent, AgentsProfileComponent, PersonsProfileComponent, FavoritesComponent, AgentUnderPlanComponent, NotificationsComponent, ChangePasswordComponent, NotificationsNewComponent, NotificationsDismissedComponent, PersonsComponent]
})
export class DashboardModule { }
