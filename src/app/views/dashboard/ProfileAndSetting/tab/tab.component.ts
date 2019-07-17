import { Component, OnInit, ViewEncapsulation, Injector } from '@angular/core';
import { BaseClass } from '../../../../global/base-class';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TabComponent extends BaseClass implements OnInit {

  constructor(private injector: Injector) { super(injector) }

  ngOnInit() {
  }
  onTabSelect(event) {
    shareTabIndexToChilds(this, event.index);
  }
}
function shareTabIndexToChilds(context: TabComponent, index: number) {
  context.dataService.onTabSelected(index);
}
