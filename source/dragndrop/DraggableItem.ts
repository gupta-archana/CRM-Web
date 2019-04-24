import { 
	Component,
	Directive,
	
	Input,
	Output,
	EventEmitter,
	HostListener,

	NgZone,
	ChangeDetectorRef,
	ViewContainerRef,
	ContentChild,
	ElementRef,
	Renderer2,
} from "@angular/core";

import { DraggableOf } from "./DraggableOf";
import { DraggableService } from "./DraggableService";

@Directive({selector: "[draggable-item]"})
export class DraggableItem
{
	constructor(
		public viewContainer: ViewContainerRef,
		public zone: NgZone,
		public hostElement: ElementRef,
		public renderer: Renderer2,
		public changeDetector: ChangeDetectorRef,

		public dragService: DraggableService,
		)
	{
		this.renderer.addClass(this.hostElement.nativeElement, "draggable-item");
		this.renderer.setAttribute(this.hostElement.nativeElement, "draggable", "true");
	}

	ngOnInit()
	{
		this.hostElement.nativeElement.removeEventListener("dragstart", this.onDragStart.bind(this));
	}

	onDragStart()
	{
		this.renderer.addClass(this.hostElement.nativeElement, "dragged");
	}

	onDragEnd()
	{
		this.renderer.removeClass(this.hostElement.nativeElement, "dragged");
	}

	currentAnimation = null;
	startAnimation(previousPosition, animationSpeed)
	{
		// Stop animation for the previous set
		this.stopAnimation();
		
		var currentPosition = this.getPosition();
		
		this.hostElement.nativeElement.style.transition = "none";
		this.hostElement.nativeElement.style.transform = 'translate3d('+ (previousPosition.left - currentPosition.left) + 'px,' + (previousPosition.top - currentPosition.top) + 'px, 0)';

		this.hostElement.nativeElement.offsetWidth; // Idk what's this doing :S

		this.hostElement.nativeElement.style.transition = "all " + animationSpeed + "ms";
		this.hostElement.nativeElement.style.transform = 'translate3d(0, 0, 0)';


		this.zone.runOutsideAngular(() => {
			this.currentAnimation = setTimeout(() => {
				// ...
				this.hostElement.nativeElement.style.transform = '';
				this.hostElement.nativeElement.style.transition = "";
				this.stopAnimation();
			}, animationSpeed);


		});
	}

	stopAnimation()
	{
		clearTimeout(this.currentAnimation);
		this.currentAnimation = null;
	}

	hasAnimation()
	{
		return this.currentAnimation != null;
	}

	animPosition = {};
	setAnimPosition()
	{
		this.animPosition = this.getPosition();
	}

	animateFromPosition(speed)
	{
		this.startAnimation(this.animPosition, speed);
	}

	getPosition()
	{
		return this.hostElement.nativeElement.getBoundingClientRect()
	}

	createGhost()
	{
		// Create ghost element
		let ghost = this.hostElement.nativeElement.cloneNode(true);
		this.renderer.addClass(ghost, "draggable-ghost-item");
		this.renderer.setStyle(ghost, "position", "fixed");
		this.renderer.setStyle(ghost, "top", "0px");
		this.renderer.setStyle(ghost, "left", "0px");
		this.renderer.setStyle(ghost, "overflow", "hidden");
		this.renderer.setStyle(ghost, "display", "block");
		
		this.renderer.setStyle(ghost, "touch-action", "none");
		this.renderer.setStyle(ghost, "pointer-events", "none");

		this.renderer.setStyle(ghost, "width", this.hostElement.nativeElement.clientWidth + "px");
		this.renderer.setStyle(ghost, "height", this.hostElement.nativeElement.clientHeight + "px");
		return ghost;
	}

}