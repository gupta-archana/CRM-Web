import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UpdateAgentProfileComponent } from "../../customUI/dialogs/update-agent-profile/update-agent-profile.component";
import { NgxSmartModalModule } from "ngx-smart-modal";
import { RecentProfilesComponent } from "../../customUI/dialogs/recent-profiles/recent-profiles.component";
import { ShareVCardComponent } from "../../customUI/dialogs/share-v-card/share-v-card.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UpdateUserProfileComponent } from "../../customUI/dialogs/update-user-profile/update-user-profile.component";
import { SearchFilterComponent } from "../../customUI/dialogs/search-filter/search-filter.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MatTabsModule } from "@angular/material/tabs";
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';

// import { CurrencyMaskModule } from "ng2-currency-mask";
import { DecimalPipe } from "@angular/common";
// import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { MomentModule } from "ngx-moment";
import { EntityNameHeaderComponent } from "../../customUI/entity-name-header/entity-name-header.component";
import { ChartsModule } from "ng2-charts";
import { AutocompleteLibModule } from "angular-ng-autocomplete";

// export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
//   align: "left",
//   allowNegative: true,
//   decimal: ",",
//   precision: 2,
//   prefix: "",
//   suffix: "",
//   thousands: ","
// };

// import { ModalService } from '../../services/modal.service';
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
        // CurrencyMaskModule,
        MomentModule,
        ChartsModule,
        AutocompleteLibModule,
    ],
    declarations: [
        UpdateAgentProfileComponent,
        RecentProfilesComponent,
        ShareVCardComponent,
        UpdateUserProfileComponent,
        SearchFilterComponent,
        EntityNameHeaderComponent,
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
        ChartsModule,
        EntityNameHeaderComponent,
        AutocompleteLibModule,
    ],
    providers: [
    // { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
        DecimalPipe,
    ],
})
export class ModulesModule {}
