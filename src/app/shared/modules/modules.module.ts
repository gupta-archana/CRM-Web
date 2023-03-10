import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateAgentProfileComponent } from '../../customUI/dialogs/update-agent-profile/update-agent-profile.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { RecentProfilesComponent } from '../../customUI/dialogs/recent-profiles/recent-profiles.component';
import { ShareVCardComponent } from '../../customUI/dialogs/share-v-card/share-v-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateUserProfileComponent } from '../../customUI/dialogs/update-user-profile/update-user-profile.component';
import { SearchFilterComponent } from '../../customUI/dialogs/search-filter/search-filter.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTabsModule, MatSnackBarModule, MatDialogModule, MatButtonModule, MatFormFieldModule } from '@angular/material';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { DecimalPipe } from '@angular/common';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { MomentModule } from 'ngx-moment';
import { EntityNameHeaderComponent } from '../../customUI/entity-name-header/entity-name-header.component';

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
    CurrencyMaskModule,
    MomentModule,

  ],
  declarations: [
    UpdateAgentProfileComponent,
    RecentProfilesComponent,
    ShareVCardComponent,
    UpdateUserProfileComponent,
    SearchFilterComponent,
    EntityNameHeaderComponent
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
    MomentModule,
    EntityNameHeaderComponent

  ],
  providers: [{ provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }, DecimalPipe],
})
export class ModulesModule { }
