import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../../global/base-class';

@Component({
  selector: 'app-news-feeds',
  templateUrl: './news-feeds.component.html',
  styleUrls: ['./news-feeds.component.css']
})
export class NewsFeedsComponent extends BaseClass implements OnInit {

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {


  }

}
