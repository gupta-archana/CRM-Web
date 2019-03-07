import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastNoAnimation, ToastNoAnimationModule } from 'ngx-toastr';
import { SidebarModule } from 'ng-sidebar';
import { UrlSerializer } from '@angular/router';
import { LowerCaseUrlSerializer } from './utils/LowerCaseUrlSerializer';
import { ApiService } from "./services/api.service";
import { appRoutes } from './app.routing';
import { DashboardModule } from './views/dashboard/dashboard.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { MatSnackBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Constants } from './Constants/Constants';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageNotFoundComponent,
    ForgotPasswordComponent
  ],
  imports: [
    BrowserModule,
    appRoutes,
    DashboardModule,
    NgbModule.forRoot(),
    MatSnackBarModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule,
    SidebarModule.forRoot(),
    ToastNoAnimationModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-center',
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
  providers: [Constants, ApiService, {
    provide: UrlSerializer,
    useClass: LowerCaseUrlSerializer
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
