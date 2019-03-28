import { Component, OnInit, Injector } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseClass } from '../../../global/base-class';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent extends BaseClass implements OnInit {
  filterSubscription: Subscription = null;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {

  }

}
