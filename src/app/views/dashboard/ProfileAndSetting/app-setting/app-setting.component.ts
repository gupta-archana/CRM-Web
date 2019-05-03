import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../../../global/base-class';

@Component({
  selector: 'app-app-setting',
  templateUrl: './app-setting.component.html',
  styleUrls: ['./app-setting.component.css']
})
export class AppSettingComponent extends BaseClass implements OnInit {

  constructor(private injector: Injector) { super(injector); }

  ngOnInit() {
  }
  rearrangeHomeModules() {
    this.commonFunctions.navigateWithoutReplaceUrl(this.paths.PATH_REARRANGE_DRAWER_ITEM);
  }

  rearrangeAgentDetailModules() {
    this.commonFunctions.navigateWithoutReplaceUrl(this.paths.PATH_REARRANGE_AGENT_DETAIL_ITEM);
  }
}
