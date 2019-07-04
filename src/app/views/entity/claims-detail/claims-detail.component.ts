import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { EntityModel } from '../../../models/entity-model';
import { ClaimsModel } from '../../../models/claims-model';

@Component({
  selector: 'app-claims-detail',
  templateUrl: './claims-detail.component.html',
  styleUrls: ['./claims-detail.component.css']
})
export class ClaimsDetailComponent extends BaseClass implements OnInit {

  entityModel: EntityModel;
  claimsModel: ClaimsModel;
  constructor(private injector: Injector) { super(injector) }

  ngOnInit() {
    this.entityModel = JSON.parse(sessionStorage.getItem(this.constants.ENTITY_INFO));
    this.claimsModel = JSON.parse(sessionStorage.getItem(this.constants.SELECTED_CLAIM));
  }
  showLessBtn(event) {
    var button = event.target || event.srcElement || event.currentTarget;
    if (button.value == "SHOW MORE") {
      button.value = "SHOW LESS";
    }
    else {
      button.value = "SHOW MORE";
    }
    this.commonFunctions.printLog(button);
  }
  goBack() {
    this.commonFunctions.backPress();
  }
  getAddition() {
    let addValues = Number(this.claimsModel.LAEAmmount) + Number(this.claimsModel.LossAmmount);

    return addValues;
  }
}
