import { Injectable, NgZone } from "@angular/core";
import { DraggableContainer } from "./DraggableContainer";
import { DraggableItem } from "./DraggableItem";

@Injectable()
export class DraggableService {
    constructor(public zone: NgZone) { }

	 dragContainers: DraggableContainer[] = [];
	 registerDragContainer(container: DraggableContainer) {
		 this.dragContainers.push(container);
	 }

    unregisterDragContainer(container: DraggableContainer) {
        this.dragContainers.splice(this.dragContainers.indexOf(container), 1);
    }

    findContainer(callback) {
        return this.dragContainers.find(callback);
    }

    findContainerByElement(element) {
        return this.dragContainers.find( container => {
            if(container.hostElement.nativeElement === element) {
                return true;
            }
            return false;
        });
    }

    isEmulatedDrag = false;
    draggedItem: DraggableItem = null;
    draggedItemContainer: DraggableContainer = null;
    setDraggedItem(draggableItem: DraggableItem, container: DraggableContainer, isEmulated: boolean = false) {
        this.draggedItem = draggableItem;
        this.draggedItemContainer = container;

        this.draggedItem.onDragStart();
        this.isEmulatedDrag = isEmulated;
    }

    setDraggedItemContainer(container: DraggableContainer) {
        this.draggedItemContainer = container;
    }

    clearDraggedItem() {
        if(this.draggedItem) {
            this.draggedItem.onDragEnd();
        }

        this.draggedItem = null;
        this.draggedItemContainer = null;
        this.isEmulatedDrag = false;
    }

    emulatedGhostElement: HTMLElement = null;
    emulatedDragOffset = {x: 0, y: 0 };
    startEmulatedDrag(draggedItem: DraggableItem, container: DraggableContainer, x: number, y: number) {
        this.stopEmulatedDrag();


        let draggableRect = draggedItem.getPosition();
        // Get the drag offset of the element relative to view port.
        this.emulatedDragOffset.x = x - draggableRect.left;
        this.emulatedDragOffset.y = y - draggableRect.top;


        // Create Ghost Element
        let ghostElement = draggedItem.createGhost();
        container.hostElement.nativeElement.appendChild(ghostElement);
        this.emulatedGhostElement = ghostElement;
        //	this.emulateDrag(x, y);
    }

    stopEmulatedDrag() {

        clearInterval(this.scrollTimer);
        this.scrollTimer = null;

        if(this.emulatedGhostElement) {
            this.emulatedGhostElement.parentElement.removeChild(this.emulatedGhostElement);
            this.emulatedGhostElement = null;
        }
    }


    emulateDrag(x, y) {
        if(!this.emulatedGhostElement) {
            return;
        }


        var left = x - this.emulatedDragOffset.x;
        var top = y - this.emulatedDragOffset.y;

        this.emulatedGhostElement.style.transform = "translate(" + (left)  + "px, " + (top) + "px)";



    }

    scrollTimer = null;
    emulateScroll(x, y, scrollSensitivity=3, scrollDistance = 75, scrollSpeed=10) {
        if(!this.emulatedGhostElement) {
            return;
        }

        if(this.scrollTimer) {
            clearInterval(this.scrollTimer);
            this.scrollTimer = null;
        }

        var scrollElement = this.getScrollElement();

        if(!scrollElement) {
            return;
        }

        var scrollX = 0;
        var scrollY = 0;

        if(scrollElement === document.documentElement || scrollElement === window) {
            if(y > scrollElement.clientHeight - scrollDistance) {
                scrollY += scrollSensitivity;
            }

            if(y < scrollDistance) {
                scrollY -= scrollSensitivity;
            }

            if(x > scrollElement.clientWidth - scrollDistance) {
                scrollX += scrollSensitivity;
            }

            if(x < scrollDistance) {
                scrollX -= scrollSensitivity;
            }


        }else{

            let scrollRect: any = scrollElement.getBoundingClientRect();

            if(y > scrollRect.bottom - scrollDistance) {
                scrollY += scrollSensitivity;
            }

            if(y < scrollRect.top + scrollDistance) {
                scrollY -= scrollSensitivity;
            }

            if(x > scrollRect.right - scrollDistance) {
                scrollX += scrollSensitivity;
            }

            if(x < scrollRect.left + scrollDistance) {
                scrollX -= scrollSensitivity;
            }
        }
        this.scrollElement(scrollElement, scrollX, scrollY);
        if(!this.scrollTimer && (scrollX !== 0 || scrollY !== 0)) {
            this.scrollTimer = setInterval(() => {
                this.scrollElement(scrollElement, scrollX, scrollY);
            }, scrollSpeed);
        }

    }

    scrollElement(element, x, y) {
        element.scrollLeft += x;
        element.scrollTop += y;
    }

    getScrollElement() {
        if(!this.emulatedGhostElement) {
            return window;
        }

        let scrollElement: any = this.emulatedGhostElement.parentNode;
        do {
            if(scrollElement.scrollHeight === 0) {
                continue;
            }

            if(scrollElement === document.documentElement || scrollElement === window) {
                return scrollElement;
            }

            let computedStyle = getComputedStyle(scrollElement, null);
            if(!computedStyle) {
                continue;
            }


            if((scrollElement.scrollHeight > scrollElement.clientHeight || scrollElement.scrollWidth > scrollElement.clientWidth)
				&& (computedStyle.getPropertyValue("overflow") === "scroll"
				|| computedStyle.getPropertyValue("overflow") === "hidden")
            ) {
                return scrollElement;
            }

        } while (scrollElement = scrollElement.parentNode);
        return window;
    }

    isTouchActive = false;
    activateTouch() {
        this.isTouchActive = true;
    }

    deactivateTouch() {
        this.isTouchActive = false;
    }

};
