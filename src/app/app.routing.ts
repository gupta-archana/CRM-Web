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
import { PersonAgentsComponent } from './views/person/person-agents/person-agents.component';
import { EntityAlertComponent } from './views/entity/entity-alert/entity-alert.component';
import { EntityAlertDetailComponent } from './views/entity/entity-alert-detail/entity-alert-detail.component';
import { ClaimsComponent } from './views/entity/claims/claims.component';
import { ClaimsDetailComponent } from './views/entity/claims-detail/claims-detail.component';
import { AuditsComponent } from './views/entity/audits/audits.component';
import { AuditDetailQueuedComponent } from './views/entity/audit-detail-queued/audit-detail-queued.component';
import { AuditDetailCompletedComponent } from './views/entity/audit-detail-completed/audit-detail-completed.component';
import { ComplianceComponent } from './views/entity/compliance/compliance.component';
import { ComplianceDetailComponent } from './views/entity/compliance-detail/compliance-detail.component';
import { NotificationControlsComponent } from './views/notification-controls/notification-controls.component';
import { PersonDetailItemsRearrangeComponent } from './views/rearrange-items-layouts/person-detail-items-rearrange/person-detail-items-rearrange.component';
import { AgentTagsComponent } from './views/agent/agent-tags/agent-tags.component';
import { SelectedTagAgentsComponent } from './views/agent/selected-tag-agents/selected-tag-agents.component';



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
    { path: paths.PATH_REARRANGE_PERSON_DETAIL_ITEM, component: PersonDetailItemsRearrangeComponent },
    { path: paths.PATH_NOTES, component: AgentNotesComponent },
    { path: paths.PATH_THIRTEEN_MONTH_ACTIVITY, component: AgentThirteenMonthActivityComponent },
    { path: paths.PATH_AGENT_ASSOCIATES, component: AgentAssociatesComponent },
    { path: paths.PATH_PERSON_AGENTS, component: PersonAgentsComponent },
    { path: paths.PATH_OPEN_ALERTS, component: EntityAlertComponent },
    { path: paths.PATH_OPEN_ALERT_DETAIL, component: EntityAlertDetailComponent },
    { path: paths.PATH_CLAIMS, component: ClaimsComponent },
    { path: paths.PATH_CLAIM_DETAIL, component: ClaimsDetailComponent },
    { path: paths.PATH_AGENT_AUDITS, component: AuditsComponent },
    { path: paths.PATH_AGENT_AUDIT_QUEUED, component: AuditDetailQueuedComponent },
    { path: paths.PATH_AGENT_AUDIT_COMPLETED, component: AuditDetailCompletedComponent },
    { path: paths.PATH_AGENT_COMPLIANCE, component: ComplianceComponent },
    { path: paths.PATH_COMPLIANCE_DETAIL, component: ComplianceDetailComponent },
    { path: paths.PATH_NOTIFICATION_CONTROL, component: NotificationControlsComponent },
    { path: paths.PATH_AGENT_TAGS, component: AgentTagsComponent },
    { path: paths.PATH_ASSOCIATED_AGENTS, component: SelectedTagAgentsComponent },
    { path: '**', component: PageNotFoundComponent }

  ];

export const appRoutes: ModuleWithProviders = RouterModule.forRoot(appRoutesArray, { useHash: false, onSameUrlNavigation: 'reload' });
