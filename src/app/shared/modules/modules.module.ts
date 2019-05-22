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
//import { ModalService } from '../../services/modal.service';
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatTabsModule,
    NgxSmartModalModule.forRoot()
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
    ReactiveFormsModule
  ]
})
export class ModulesModule { }
