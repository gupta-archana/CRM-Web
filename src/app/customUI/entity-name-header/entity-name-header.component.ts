import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { EntityModel } from '../../models/entity-model';
import { Subscription } from 'rxjs';
import { DataServiceService } from '../../services/data-service.service';
import { Constants } from '../../Constants/Constants';

@Component({
  selector: 'app-entity-name-header',
  templateUrl: './entity-name-header.component.html',
  styleUrls: ['./entity-name-header.component.css']
})
export class EntityNameHeaderComponent implements OnInit, OnDestroy {

  constructor(private dataService: DataServiceService, private cdr: ChangeDetectorRef, public constants: Constants) { }
  @Input()
  entityModel: EntityModel;
  loadedItemsTagSubscription: Subscription;
  loadedItemsTag: string = "";
  ngOnInit() {
    let self = this;
    this.loadedItemsTagSubscription = this.dataService.shareLoadedItemsObservable.subscribe(tag => {
      console.log(this.entityModel)
      if (tag == self.constants.NO_DATA_AVAILABLE)
        tag = " ";
      this.loadedItemsTag = tag;

      this.cdr.markForCheck();
    })

  }
  ngOnDestroy(): void {
    if (this.loadedItemsTagSubscription && !this.loadedItemsTagSubscription.closed)
      this.loadedItemsTagSubscription.unsubscribe();
  }

}
