import { Routes } from '@angular/router';
import { NavigationDrawerComponent } from './navigation-drawer/navigation-drawer.component';
import { TopAgentsComponent } from './top-agents/top-agents.component';
import { AuthGuardService } from '../../guards/auth-guard.service';
import { AgentWithAlertComponent } from './agent-with-alert/agent-with-alert.component';
import * as path from '../../Constants/paths';
import { AgentWithPerformanceComponent } from './agent-with-performance/agent-with-performance.component';

export const dashboardRoutes: Routes = [
    {
        path: '',
        component: NavigationDrawerComponent,
        canActivate: [AuthGuardService],
        children: [
            { path: '', redirectTo: 'topAgents', pathMatch: 'full' },
            { path: path.PATH_TOP_AGENTS, component: TopAgentsComponent },
            { path: path.PATH_AGENTS_WITH_ALERT, component: AgentWithAlertComponent },
            { path: path.PATH_AGENTS_WITH_PERFORMANCE, component: AgentWithPerformanceComponent }

        ]
    }
];