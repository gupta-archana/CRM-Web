import { Component, OnInit, Injector, ChangeDetectionStrategy } from '@angular/core';
import { BaseClass } from 'src/app/global/base-class';
import { EntityModel } from 'src/app/models/entity-model';
import { ApiResponseCallback } from 'src/app/Interfaces/ApiResponseCallback';
import { EventModel } from 'src/app/models/event-model';
import { UserModel } from 'src/app/models/UserModel';

@Component({
    selector: 'app-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventsComponent extends BaseClass implements OnInit, ApiResponseCallback {

    constructor(private injector: Injector) {
        super(injector);
    }
    entityModel: EntityModel;
    eventModels: EventModel[] = [];
    ngOnInit() {
        this.entityModel = JSON.parse(sessionStorage.getItem(this.constants.ENTITY_INFO));


        this.apiHandler.getEvents(this.entityModel.type, this.entityModel.entityId, this);
    }

    onAddNewEventClick() {
        this.openDialogService.showAddNewEventDialog().afterClosed().subscribe(added => {
            this.commonFunctions.showSnackbar("added");
        });
    }

    onSuccess(response: any) {
        this.eventModels = response.event;
        this.cdr.markForCheck();
    }
    onError(errorCode: number, errorMsg: string) {
        throw new Error("Method not implemented.");
    }

}
