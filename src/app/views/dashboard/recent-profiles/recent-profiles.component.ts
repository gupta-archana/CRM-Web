import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../../global/base-class';

@Component({
  selector: 'app-recent-profiles',
  templateUrl: './recent-profiles.component.html',
  styleUrls: ['./recent-profiles.component.css']
})
export class RecentProfilesComponent extends BaseClass implements OnInit {

  constructor(private injector: Injector) { super(injector) }

  ngOnInit() {
  }
  onTabSelect(event) {
    //this.commonFunctions.showSnackbar(event.index);
    this.commonFunctions.printLog(event);
    shareTabIndexToChilds(this, event.index);
  }
}
function shareTabIndexToChilds(context: RecentProfilesComponent, index: number) {
  context.dataService.onTabSelected(index);
}
