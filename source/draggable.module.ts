import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';

import { DraggableContainer, DraggableOf, DraggableService, DraggableItem } from "./dragndrop";

var DRAGGABLES = [ DraggableContainer, DraggableOf, DraggableItem ];

@NgModule({
  	declarations: [
	  	DRAGGABLES
  	],
  	imports: [
    	CommonModule,
  	],
  	exports: [
	    DRAGGABLES
  	],
  	providers: [DraggableService],
})
export class DraggableModule {}
