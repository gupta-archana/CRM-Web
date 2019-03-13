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


const appRoutesArray: Routes =
    [
        { path: '', component: AppComponent },
        { path: paths.PATH_LOGIN, component: LoginComponent, canDeactivate: [LoginGuardGuard] },
        { path: '', redirectTo: '', pathMatch: 'full' },
        { path: paths.PATH_FORGOT_PASSWORD, component: ForgotPasswordComponent },
        { path: paths.PATH_AGENT_CONTACT_DETAIL, component: ContactDetailComponent },
        { path: paths.PATH_AGENT_OBJECTIVE, component: AgentObjectiveComponent },
        { path: '**', component: PageNotFoundComponent }

    ];

export const appRoutes: ModuleWithProviders = RouterModule.forRoot(appRoutesArray, { useHash: false });
