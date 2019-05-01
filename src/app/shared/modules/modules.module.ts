import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateAgentProfileComponent } from '../../customUI/dialogs/update-agent-profile/update-agent-profile.component';
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    UpdateAgentProfileComponent
  ],
  exports: [
    UpdateAgentProfileComponent
  ]
})
export class ModulesModule { }
