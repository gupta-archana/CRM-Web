import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { HttpModule } from '@angular/http';

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

import { DragDropModule } from '@angular/cdk/drag-drop';
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
import { DeviceDetectorModule } from 'ngx-device-detector';
import { DraggableModule } from '../../source/draggable.module';
import { NgxVcardModule } from 'ngx-vcard';
import { ModulesModule } from './shared/modules/modules.module';
import { DrawerItemsRearrangeComponent } from './views/rearrange-items-layouts/drawer-items-rearrange/drawer-items-rearrange.component';
import { AgentDetailItemRearrangeComponent } from './views/rearrange-items-layouts/agent-detail-item-rearrange/agent-detail-item-rearrange.component';
import { AgentNotesComponent } from './views/agent/agent-notes/agent-notes.component';
import { AllNotesComponent } from './views/agent/agent-notes/all-notes/all-notes.component';
import { MyNotesComponent } from './views/agent/agent-notes/my-notes/my-notes.component';
import { AddNoteComponent } from './customUI/dialogs/add-note/add-note.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { AgentThirteenMonthActivityComponent } from './views/agent/agent-thirteen-month-activity/agent-thirteen-month-activity.component';
import { AgentAssociatesComponent } from './views/agent/agent-associates/agent-associates.component';
import { PersonDetailComponent } from './views/person/person-detail/person-detail.component';
import { PersonAgentsComponent } from './views/person/person-agents/person-agents.component';
import { UpdateNoteComponent } from './customUI/dialogs/update-note/update-note.component';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { EntityNameHeaderComponent } from './customUI/entity-name-header/entity-name-header.component';
import { EntityAlertComponent } from './views/entity/entity-alert/entity-alert.component';
import { EntityAlertDetailComponent } from './views/entity/entity-alert-detail/entity-alert-detail.component';
import { MarkAsReviewedDialogComponent } from './customUI/dialogs/mark-as-reviewed-dialog/mark-as-reviewed-dialog.component';
import { ClaimsComponent } from './views/entity/claims/claims.component';
import { ClaimsDetailComponent } from './views/entity/claims-detail/claims-detail.component';
import { AssignedToComponent } from './customUI/dialogs/assigned-to/assigned-to.component';
import { DownloadPdfComponent } from './customUI/dialogs/download-pdf/download-pdf.component';
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
    EntityNameHeaderComponent,
    EntityAlertComponent,
    EntityAlertDetailComponent,
    MarkAsReviewedDialogComponent,
    ClaimsComponent,
    ClaimsDetailComponent,
    AssignedToComponent,
    DownloadPdfComponent,
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
    CurrencyMaskModule
  ],
  entryComponents: [
    // See https://material.angular.io/components/dialog/overview#configuring-dialog-content-via-code-entrycomponents-code- for more info
    AlertDialogComponent,
    ConfirmationDialogComponent,
    ForgotPasswordAlertComponent,
    ChangeProfileDialogComponent
  ],
  providers: [Constants, ApiService,
    { provide: UrlSerializer, useClass: LowerCaseUrlSerializer },
    LoginGuardGuard,
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
