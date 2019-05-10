import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core/src/metadata/ng_module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { LoginComponent } from './views/login/login.component';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { LoginGuardGuard } from './guards/login-guard.guard';
import * as paths from './Constants/paths';
import { ContactDetailComponent } from './views/agent/contact-detail/contact-detail.component';
import { AgentObjectiveComponent } from './views/agent/agent-objective/agent-objective.component';
import { DrawerItemsRearrangeComponent } from './views/rearrange-items-layouts/drawer-items-rearrange/drawer-items-rearrange.component';
import { AgentDetailItemRearrangeComponent } from './views/rearrange-items-layouts/agent-detail-item-rearrange/agent-detail-item-rearrange.component';
import { AgentNotesComponent } from './views/agent/agent-notes/agent-notes.component';
import { AgentThirteenMonthActivityComponent } from './views/agent/agent-thirteen-month-activity/agent-thirteen-month-activity.component';
import { AgentAssociatesComponent } from './views/agent/agent-associates/agent-associates.component';


const appRoutesArray: Routes =
  [
    { path: '', component: AppComponent },
    { path: paths.PATH_LOGIN, component: LoginComponent, canDeactivate: [LoginGuardGuard] },
    { path: '', redirectTo: '', pathMatch: 'full' },
    { path: paths.PATH_FORGOT_PASSWORD, component: ForgotPasswordComponent },
    { path: paths.PATH_AGENT_CONTACT_DETAIL, component: ContactDetailComponent },
    { path: paths.PATH_AGENT_OBJECTIVE, component: AgentObjectiveComponent },
    { path: paths.PATH_REARRANGE_DRAWER_ITEM, component: DrawerItemsRearrangeComponent },
    { path: paths.PATH_REARRANGE_AGENT_DETAIL_ITEM, component: AgentDetailItemRearrangeComponent },
    { path: paths.PATH_NOTES, component: AgentNotesComponent },
    { path: paths.PATH_THIRTEEN_MONTH_ACTIVITY, component: AgentThirteenMonthActivityComponent },
    { path: paths.PATH_AGENT_ASSOCIATES, component: AgentAssociatesComponent },
    { path: '**', component: PageNotFoundComponent }

  ];

export const appRoutes: ModuleWithProviders = RouterModule.forRoot(appRoutesArray, { useHash: false, onSameUrlNavigation: 'reload' });
