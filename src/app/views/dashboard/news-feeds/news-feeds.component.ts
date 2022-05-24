import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';
import { NewsFeed } from '../../../models/news-feed';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-news-feeds',
    templateUrl: './news-feeds.component.html',
    styleUrls: ['./news-feeds.component.css']
})
export class NewsFeedsComponent extends BaseClass implements OnInit, ApiResponseCallback, OnDestroy {


    newsFeeds: Array<NewsFeed> = [];
    refreshPageSubscription: Subscription = null;
    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit() {

        this.doRequest();
        registerRefreshNewsEvent(this);
    }


    public doRequest() {
        this.dataService.onHideShowLoader(true);
        this.newsFeeds = [];
        this.cdr.markForCheck();
        this.apiHandler.getNews(this);
    }

    onSuccess(response: any) {
        this.dataService.onHideShowLoader(false);
        this.newsFeeds = response.items;
        this.cdr.markForCheck();
    }
    onError(errorCode: number, errorMsg: string) {
        this.dataService.onHideShowLoader(false);
        this.commonFunctions.showErrorSnackbar(errorMsg);
    }

    onNewsClick(item: NewsFeed) {
        window.open(item.link, "_blank");
    }

    ngOnDestroy(): void {
        if (this.refreshPageSubscription && !this.refreshPageSubscription.closed) {
            this.refreshPageSubscription.unsubscribe();
        }
    }
}

function registerRefreshNewsEvent(context: NewsFeedsComponent) {
    context.refreshPageSubscription = context.dataService.pageRefreshObservable.subscribe(data => {
        context.doRequest();
    });
}
