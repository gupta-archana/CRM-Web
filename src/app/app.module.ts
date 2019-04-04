import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastNoAnimation, ToastNoAnimationModule } from 'ngx-toastr';
import { LoginGuardGuard } from './guards/login-guard.guard';
import { SidebarModule } from 'ng-sidebar';
import { UrlSerializer } from '@angular/router';
import { LowerCaseUrlSerializer } from './utils/LowerCaseUrlSerializer';
import { ApiService } from "./services/api.service";
import { appRoutes } from './app.routing';
import { DashboardModule } from './views/dashboard/dashboard.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { MatSnackBarModule, MatDialogModule, MatButtonModule, MatFormFieldModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Constants } from './Constants/Constants';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { AgentDetailComponent } from './views/agent/agent-detail/agent-detail.component';
import { ContactDetailComponent } from './views/agent/contact-detail/contact-detail.component';
import { AgentObjectiveComponent } from './views/agent/agent-objective/agent-objective.component';
import { AlertDialogComponent } from './customUI/dialogs/alert-dialog/alert-dialog.component';
import { ConfirmationDialogComponent } from './customUI/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ForgotPasswordAlertComponent } from './customUI/dialogs/forgot-password/forgot-password-alert.component';
import { ChangeProfileDialogComponent } from './customUI/dialogs/change-profile-dialog/change-profile-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageNotFoundComponent,
    ForgotPasswordComponent,
    ForgotPasswordAlertComponent,
    AgentDetailComponent,
    ContactDetailComponent,
    AgentObjectiveComponent,
    AlertDialogComponent,
    ConfirmationDialogComponent,
    ChangeProfileDialogComponent

  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    appRoutes,
    DashboardModule,
    NgbModule.forRoot(),
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    HttpModule,

    ToastrModule,
    SidebarModule.forRoot(),
    ToastNoAnimationModule.forRoot({
      timeOut: 2500,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
    }),
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.cubeGrid,
      backdropBackgroundColour: 'rgba(0,0,0,0.7)',
      backdropBorderRadius: '1px',
      primaryColour: '#ffffff',
      secondaryColour: '#ffffff',
      tertiaryColour: '#ffffff',
      fullScreenBackdrop: true
    }),
  ],
  entryComponents: [
    // See https://material.angular.io/components/dialog/overview#configuring-dialog-content-via-code-entrycomponents-code- for more info
    AlertDialogComponent,
    ConfirmationDialogComponent,
    ForgotPasswordAlertComponent
  ],
  providers: [Constants, ApiService, {
    provide: UrlSerializer,
    useClass: LowerCaseUrlSerializer
  }, LoginGuardGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
