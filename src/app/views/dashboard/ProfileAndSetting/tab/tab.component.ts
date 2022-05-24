import {
    Component,
    OnInit,
    ViewEncapsulation,
    Injector,
    ViewChild,
} from "@angular/core";
import { BaseClass } from "../../../../global/base-class";
import { MatTabGroup } from "@angular/material/tabs";
import { Subscription } from "rxjs";

@Component({
    selector: "app-tab",
    templateUrl: "./tab.component.html",
    styleUrls: ["./tab.component.css"],
    encapsulation: ViewEncapsulation.None,
})
export class TabComponent extends BaseClass implements OnInit {
    @ViewChild("tabGroup", { static: true })
        tabGroup: MatTabGroup;
    tabSelectedSubscription: Subscription;
    constructor(private injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        this.commonFunctions.showLoadedItemTagOnHeader([], 0, true);
        TabChanged(this);
    }
    onTabSelect(event) {
        shareTabIndexToChilds(this, event.index);
    }
}
function shareTabIndexToChilds(context: TabComponent, index: number) {
    context.dataService.onTabSelected(index);
}
function TabChanged(context: TabComponent) {
    context.tabSelectedSubscription =
    context.dataService.tabSelectedObservable.subscribe((index) => {
        if (index !== context.tabGroup.selectedIndex) {
            context.tabGroup.selectedIndex = index;
        }
    });
}
