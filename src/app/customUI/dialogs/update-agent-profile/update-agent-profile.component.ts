import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseClass } from '../../../global/base-class';

@Component({
  selector: 'app-update-agent-profile',
  templateUrl: './update-agent-profile.component.html',
  styleUrls: ['./update-agent-profile.component.css']
})
export class UpdateAgentProfileComponent extends BaseClass implements OnInit, OnDestroy {

  showAgentProfileDialog: boolean = false;
  agentProfileEditSubscription: Subscription = null;
  constructor(private injector: Injector) { super(injector) }

  ngOnInit() {
    this.agentProfileEditSubscription = this.dataService.editAgentProfileDialogObservable.subscribe(openDialog => {
      this.openModal(openDialog);
    });

  }
  private openModal(open: boolean): void {
    this.showAgentProfileDialog = open;
  }

  ngOnDestroy(): void {
    if (this.agentProfileEditSubscription && !this.agentProfileEditSubscription.closed) {
      this.agentProfileEditSubscription.unsubscribe();
    }
    //throw new Error("Method not implemented.");
  }
}
