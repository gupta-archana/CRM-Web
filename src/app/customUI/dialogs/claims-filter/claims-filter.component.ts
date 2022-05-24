import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../../global/base-class';

@Component({
    selector: 'app-claims-filter',
    templateUrl: './claims-filter.component.html',
    styleUrls: ['./claims-filter.component.css']
})
export class ClaimsFilterComponent extends BaseClass implements OnInit {
    isOpenChecked = false;
    isClosedChecked = false;
    disableSave = true;
    constructor(private injector: Injector) {
        super(injector);
    }

    ngOnInit() {
    }

    openCheckChanged(event: any) {
        this.disableSave = false;
        this.isOpenChecked = event.target.checked;

    }
    closedCheckChanged(event: any) {
        this.disableSave = false;
        this.isClosedChecked = event.target.checked;
    }
    onApplyClick() {
        const ClaimsTypeData = {
            openChecked: this.isOpenChecked,
            closeChecked: this.isClosedChecked
        };
        this.dataService.onDataShare(ClaimsTypeData);
    }
}
