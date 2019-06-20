import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateAgentProfileComponent } from '../../customUI/dialogs/update-agent-profile/update-agent-profile.component';
import { MatTabsModule } from '@angular/material';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { RecentProfilesComponent } from '../../customUI/dialogs/recent-profiles/recent-profiles.component';
import { ShareVCardComponent } from '../../customUI/dialogs/share-v-card/share-v-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateUserProfileComponent } from '../../customUI/dialogs/update-user-profile/update-user-profile.component';
import { SearchFilterComponent } from '../../customUI/dialogs/search-filter/search-filter.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBarModule, MatDialogModule, MatButtonModule, MatFormFieldModule } from '@angular/material';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: "left",
  allowNegative: true,
  decimal: ",",
  precision: 2,
  prefix: "",
  suffix: "",
  thousands: ","
};

//import { ModalService } from '../../services/modal.service';
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatTabsModule,
    NgxSmartModalModule.forRoot(),
    NgbModule.forRoot(),
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    CurrencyMaskModule
  ],
  declarations: [
    UpdateAgentProfileComponent,
    RecentProfilesComponent,
    ShareVCardComponent,
    UpdateUserProfileComponent,
    SearchFilterComponent

  ],
  exports: [
    UpdateAgentProfileComponent,
    RecentProfilesComponent,
    MatTabsModule,
    NgxSmartModalModule,
    ShareVCardComponent,
    UpdateUserProfileComponent,
    SearchFilterComponent,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,

  ],
  providers: [{ provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }],
})
export class ModulesModule { }
