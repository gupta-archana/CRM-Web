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
import { RecentProfilesComponent } from '../../customUI/dialogs/recent-profiles/recent-profiles.component';
import { NewsFeedsComponent } from './news-feeds/news-feeds.component';
import { TabComponent } from './ProfileAndSetting/tab/tab.component';
import { MatTabsModule } from '@angular/material';
import { ProfileSettingComponent } from './ProfileAndSetting/profile-setting/profile-setting.component';
import { AppSettingComponent } from './ProfileAndSetting/app-setting/app-setting.component';
import { ModulesModule } from '../../shared/modules/modules.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(dashboardRoutes),
    FormsModule, ReactiveFormsModule, MatTabsModule, ModulesModule
  ],
  providers: [AuthGuardService, CanDeactivateGuard],
  declarations: [NavigationDrawerComponent, TopAgentsComponent, AgentWithAlertComponent, AgentWithPerformanceComponent, SearchComponent, NewsFeedsComponent, RecentProfilesComponent, TabComponent, ProfileSettingComponent, AppSettingComponent]
})
export class DashboardModule { }
