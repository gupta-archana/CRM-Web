import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { EntityModel } from '../../models/entity-model';
import { Subscription } from 'rxjs';
import { DataServiceService } from '../../services/data-service.service';

@Component({
  selector: 'app-entity-name-header',
  templateUrl: './entity-name-header.component.html',
  styleUrls: ['./entity-name-header.component.css']
})
export class EntityNameHeaderComponent implements OnInit, OnDestroy {

  constructor(private dataService: DataServiceService, private cdr: ChangeDetectorRef) { }
  @Input()
  entityModel: EntityModel;
  loadedItemsTagSubscription: Subscription;
  loadedItemsTag: string = "";
  ngOnInit() {
    this.loadedItemsTagSubscription = this.dataService.shareLoadedItemsObservable.subscribe(tag => {
      this.loadedItemsTag = tag;
      this.cdr.markForCheck();
    })

  }
  ngOnDestroy(): void {
    if (this.loadedItemsTagSubscription && !this.loadedItemsTagSubscription.closed)
      this.loadedItemsTagSubscription.unsubscribe();
  }

}
