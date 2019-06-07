import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { Subscription } from 'rxjs';
import { EntityModel } from '../../../models/entity-model';
import { Router } from '@angular/router';
import { CommonApisService } from '../../../utils/common-apis.service';
import { EntityDetailBaseClass } from '../../../global/entity-detail-base-class';

@Component({
  selector: 'app-person-detail',
  templateUrl: './person-detail.component.html',
  styleUrls: ['./person-detail.component.css']
})
export class PersonDetailComponent extends EntityDetailBaseClass implements OnInit, OnDestroy {
  personInfoSubscription: Subscription = null;
  personMenuSub: Subscription = null;
  personInfo: EntityModel;
  personMenues: any[];
  constructor(injector: Injector,
    private router: Router) {
    super(injector);
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.personInfo = JSON.parse(sessionStorage.getItem(this.constants.ENTITY_INFO));
    this.addNewHistoryEntity(this.personInfo);
    getMenues(this);
  }
  onPersonMenuClick(item) {
    this.commonFunctions.onMenuItemClick(item, this.personInfo);
  }

  checkEntityFavorite() {
    return !this.commonFunctions.checkFavorite(this.personInfo.entityId);
  }
  onStarClick(item: EntityModel) {
    this.commonApis.setFavorite(item, this.apiHandler, this.cdr);
  }
  ngOnDestroy(): void {
    if (this.personMenuSub && !this.personMenuSub.closed) {
      this.personMenuSub.unsubscribe();
    }

    if (this.personInfoSubscription && !this.personInfoSubscription.closed) {
      this.personInfoSubscription.unsubscribe();
    }
  }
}
function getMenues(context: PersonDetailComponent) {
  context.personMenuSub = context.utils.getPersonDetailItems().subscribe(success => {
    context.personMenues = success;
    context.cdr.markForCheck();
  });

}
