import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateAgentProfileComponent } from '../../customUI/dialogs/update-agent-profile/update-agent-profile.component';
import { MatTabsModule } from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    MatTabsModule
  ],
  declarations: [
    UpdateAgentProfileComponent
  ],
  exports: [
    UpdateAgentProfileComponent,
    MatTabsModule
  ]
})
export class ModulesModule { }
