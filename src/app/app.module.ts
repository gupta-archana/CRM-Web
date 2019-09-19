import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UrlSerializer } from '@angular/router';
import { SidebarModule } from 'ng-sidebar';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ngxLoadingAnimationTypes, NgxLoadingModule } from 'ngx-loading';
import { ToastNoAnimationModule, ToastrModule } from 'ngx-toastr';
import { NgxVcardModule } from 'ngx-vcard';
import { DraggableModule } from '../../source/draggable.module';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routing';
import { Constants } from './Constants/Constants';
import { AddNoteComponent } from './customUI/dialogs/add-note/add-note.component';
import { AlertDialogComponent } from './customUI/dialogs/alert-dialog/alert-dialog.component';
import { AssignedToComponent } from './customUI/dialogs/assigned-to/assigned-to.component';
import { ChangeProfileDialogComponent } from './customUI/dialogs/change-profile-dialog/change-profile-dialog.component';
import { ClaimsFilterComponent } from './customUI/dialogs/claims-filter/claims-filter.component';
import { ConfirmationDialogComponent } from './customUI/dialogs/confirmation-dialog/confirmation-dialog.component';
import { DownloadPdfComponent } from './customUI/dialogs/download-pdf/download-pdf.component';
import { EmailNocComponent } from './customUI/dialogs/email-noc/email-noc.component';
import { ForgotPasswordAlertComponent } from './customUI/dialogs/forgot-password/forgot-password-alert.component';
import { MarkAsReviewedDialogComponent } from './customUI/dialogs/mark-as-reviewed-dialog/mark-as-reviewed-dialog.component';
import { SendEmailConfirmationComponent } from './customUI/dialogs/send-email-confirmation/send-email-confirmation.component';
import { UpdateNoteComponent } from './customUI/dialogs/update-note/update-note.component';

import { LoginGuardGuard } from './guards/login-guard.guard';
import { ApiService } from "./services/api.service";
import { ModulesModule } from './shared/modules/modules.module';
import { LowerCaseUrlSerializer } from './utils/LowerCaseUrlSerializer';
import { AgentAssociatesComponent } from './views/agent/agent-associates/agent-associates.component';
import { AgentDetailComponent } from './views/agent/agent-detail/agent-detail.component';
import { AgentNotesComponent } from './views/agent/agent-notes/agent-notes.component';
import { AllNotesComponent } from './views/agent/agent-notes/all-notes/all-notes.component';
import { MyNotesComponent } from './views/agent/agent-notes/my-notes/my-notes.component';
import { AgentObjectiveComponent } from './views/agent/agent-objective/agent-objective.component';
import { AgentThirteenMonthActivityComponent } from './views/agent/agent-thirteen-month-activity/agent-thirteen-month-activity.component';
import { ContactDetailComponent } from './views/agent/contact-detail/contact-detail.component';
import { DashboardModule } from './views/dashboard/dashboard.module';
import { AuditDetailCompletedComponent } from './views/entity/audit-detail-completed/audit-detail-completed.component';
import { AuditDetailQueuedComponent } from './views/entity/audit-detail-queued/audit-detail-queued.component';
import { AuditsComponent } from './views/entity/audits/audits.component';
import { ClaimsDetailComponent } from './views/entity/claims-detail/claims-detail.component';
import { ClaimsComponent } from './views/entity/claims/claims.component';
import { ComplianceDetailComponent } from './views/entity/compliance-detail/compliance-detail.component';
import { ComplianceComponent } from './views/entity/compliance/compliance.component';
import { EntityAlertDetailComponent } from './views/entity/entity-alert-detail/entity-alert-detail.component';
import { EntityAlertComponent } from './views/entity/entity-alert/entity-alert.component';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { LoginComponent } from './views/login/login.component';
import { NotificationControlsComponent } from './views/notification-controls/notification-controls.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { PersonAgentsComponent } from './views/person/person-agents/person-agents.component';
import { PersonDetailComponent } from './views/person/person-detail/person-detail.component';
import { AgentDetailItemRearrangeComponent } from './views/rearrange-items-layouts/agent-detail-item-rearrange/agent-detail-item-rearrange.component';
import { DrawerItemsRearrangeComponent } from './views/rearrange-items-layouts/drawer-items-rearrange/drawer-items-rearrange.component';
import { PersonDetailItemsRearrangeComponent } from './views/rearrange-items-layouts/person-detail-items-rearrange/person-detail-items-rearrange.component';




export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: "left",
  allowNegative: true,
  decimal: ",",
  precision: 2,
  prefix: "",
  suffix: "",
  thousands: ","
};

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
    ChangeProfileDialogComponent,
    DrawerItemsRearrangeComponent,
    AgentDetailItemRearrangeComponent,
    AgentNotesComponent,
    AllNotesComponent,
    MyNotesComponent,
    AddNoteComponent,
    AgentThirteenMonthActivityComponent,
    AgentAssociatesComponent,
    PersonDetailComponent,
    PersonAgentsComponent,
    UpdateNoteComponent,
    EntityAlertComponent,
    EntityAlertDetailComponent,
    MarkAsReviewedDialogComponent,
    ClaimsComponent,
    ClaimsDetailComponent,
    AssignedToComponent,
    DownloadPdfComponent,
    ClaimsFilterComponent,
    AuditsComponent,
    AuditDetailCompletedComponent,
    AuditDetailQueuedComponent,
    SendEmailConfirmationComponent,
    ComplianceComponent,
    ComplianceDetailComponent,
    EmailNocComponent,
    NotificationControlsComponent,
    PersonDetailItemsRearrangeComponent,

  ],
  imports: [
    BrowserModule,
    appRoutes,
    DashboardModule,
    BrowserAnimationsModule,
    HttpModule,
    DeviceDetectorModule.forRoot(),
    ImageCropperModule,
    ToastrModule,
    NgxVcardModule,
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
    DraggableModule,
    ModulesModule,
    DragDropModule,
    Ng2ImgMaxModule,
    CurrencyMaskModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    // See https://material.angular.io/components/dialog/overview#configuring-dialog-content-via-code-entrycomponents-code- for more info
    AlertDialogComponent,
    ConfirmationDialogComponent,
    ForgotPasswordAlertComponent,
    ChangeProfileDialogComponent,
    MarkAsReviewedDialogComponent,
    SendEmailConfirmationComponent,
    DownloadPdfComponent,
    EmailNocComponent,
    AssignedToComponent
  ],
  providers: [Constants, ApiService,
    { provide: UrlSerializer, useClass: LowerCaseUrlSerializer },
    LoginGuardGuard,
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
