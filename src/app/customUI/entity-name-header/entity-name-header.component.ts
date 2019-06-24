import { Component, OnInit, Input } from '@angular/core';
import { EntityModel } from '../../models/entity-model';

@Component({
  selector: 'app-entity-name-header',
  templateUrl: './entity-name-header.component.html',
  styleUrls: ['./entity-name-header.component.css']
})
export class EntityNameHeaderComponent implements OnInit {

  constructor() { }
  @Input()
  entityModel: EntityModel;
  ngOnInit() {
  }

}
