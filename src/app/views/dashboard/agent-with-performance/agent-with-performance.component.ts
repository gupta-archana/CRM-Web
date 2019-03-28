import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataServiceService } from '../../../services/data-service.service';
import { Subscription } from 'rxjs';
import { CommonFunctionsService } from '../../../utils/common-functions.service';

@Component({
  selector: 'app-agent-with-performance',
  templateUrl: './agent-with-performance.component.html',
  styleUrls: ['./agent-with-performance.component.css']
})
export class AgentWithPerformanceComponent implements OnInit, OnDestroy {

  pageRefreshSubscription: Subscription = null;
  constructor(private dataService: DataServiceService,
    private commonFunctions: CommonFunctionsService) { }

  ngOnInit() {
    this.commonFunctions.hideShowTopScrollButton();
    this.pageRefreshSubscription = this.dataService.pageRefreshObservable.subscribe(data => {
    });
  }
  // When the user clicks on the button, scroll to the top of the document
  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  ngOnDestroy(): void {
    if (this.pageRefreshSubscription && !this.pageRefreshSubscription.closed) {
      this.pageRefreshSubscription.unsubscribe();
    }
  }
}
