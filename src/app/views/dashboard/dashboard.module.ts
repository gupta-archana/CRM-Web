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
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(dashboardRoutes),
    FormsModule, ReactiveFormsModule
  ],
  providers: [AuthGuardService, CanDeactivateGuard],
  declarations: [NavigationDrawerComponent, TopAgentsComponent, AgentWithAlertComponent, AgentWithPerformanceComponent, SearchComponent]
})
export class DashboardModule { }
