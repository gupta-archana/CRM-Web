import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core/src/metadata/ng_module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { LoginComponent } from './views/login/login.component';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { LoginGuardGuard } from './guards/login-guard.guard';


const appRoutesArray: Routes =
    [
        { path: '', component: AppComponent },
        { path: 'login', component: LoginComponent, canDeactivate: [LoginGuardGuard] },
        { path: '', redirectTo: '', pathMatch: 'full' },
        { path: 'forgot-password', component: ForgotPasswordComponent },
        { path: '**', component: PageNotFoundComponent }

    ];

export const appRoutes: ModuleWithProviders = RouterModule.forRoot(appRoutesArray, { useHash: false });
