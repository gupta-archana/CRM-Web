import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateAgentProfileComponent } from '../../customUI/dialogs/update-agent-profile/update-agent-profile.component';
import { MatTabsModule } from '@angular/material';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { RecentProfilesComponent } from '../../customUI/dialogs/recent-profiles/recent-profiles.component';
//import { ModalService } from '../../services/modal.service';
@NgModule({
  imports: [
    CommonModule,
    MatTabsModule,
    NgxSmartModalModule.forRoot()
  ],
  declarations: [
    UpdateAgentProfileComponent,
    RecentProfilesComponent
  ],
  exports: [
    UpdateAgentProfileComponent,
    RecentProfilesComponent,
    MatTabsModule,
    NgxSmartModalModule
  ]
})
export class ModulesModule { }
