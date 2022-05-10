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
  ContentChildren,
  ViewChildren,
  ViewRef,
  QueryList,
  ElementRef,
  Renderer2,
  OnInit,
  OnDestroy,
  AfterViewInit,
} from "@angular/core";

import { DraggableOf } from "./DraggableOf";
import { DraggableService } from "./DraggableService";
import { DraggableItem } from "./DraggableItem";

@Directive({ selector: "[draggable-container]" })
export class DraggableContainer implements OnInit, OnDestroy, AfterViewInit {
  @Input("containerId")
  containerId = null;

  @Input("draggable-container")
  containerType = null;

  @Input("disabledElements")
  public disabledElements = ["button-card"];

  @Input("disabledTags")
  disabledTags = ["button", "input", "a", "textarea"];

  @Input("animationSpeed")
  animationSpeed = 100;

  @Input("touchDragDelay")
  touchDragDelay = 200;

  @ContentChild(DraggableOf, { static: false })
  draggableOf: DraggableOf<any>;

  @ContentChildren(DraggableItem, { descendants: true })
  draggableChildren: QueryList<DraggableItem>;

  draggableItems: DraggableItem[] = [];

  // Triggered when the list is updated
  @Output("onSort")
  public onSort = new EventEmitter();

  constructor(
    public viewContainer: ViewContainerRef,
    public dragService: DraggableService,
    public zone: NgZone,
    public hostElement: ElementRef,
    public renderer: Renderer2,
    public changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.dragService.registerDragContainer(this);
    this.zone.runOutsideAngular(() => {
      this.hostElement.nativeElement.addEventListener(
        "dragover",
        this.onDragOver.bind(this)
      );
      this.hostElement.nativeElement.addEventListener(
        "dragenter",
        this.onDragEnter.bind(this)
      );
      this.hostElement.nativeElement.addEventListener(
        "dragleave",
        this.onDragLeave.bind(this)
      );

      this.hostElement.nativeElement.addEventListener(
        "dragstart",
        this.onDragStart.bind(this)
      );
      this.hostElement.nativeElement.addEventListener(
        "drop",
        this.onDragDrop.bind(this)
      );
      this.hostElement.nativeElement.addEventListener(
        "dragend",
        this.onDragEnd.bind(this)
      );

      this.hostElement.nativeElement.addEventListener(
        "selectstart",
        this.onSelectStart.bind(this)
      );

      this.hostElement.nativeElement.addEventListener(
        "touchstart",
        this.onTouchStart.bind(this),
        false
      );
      this.hostElement.nativeElement.addEventListener(
        "touchend",
        this.onTouchEnd.bind(this),
        false
      );
      this.hostElement.nativeElement.addEventListener(
        "touchmove",
        this.onTouchMove.bind(this),
        false
      );
    });
  }

  ngOnDestroy() {
    this.dragService.unregisterDragContainer(this);

    this.zone.runOutsideAngular(() => {
      this.hostElement.nativeElement.removeEventListener(
        "dragover",
        this.onDragOver.bind(this)
      );
      this.hostElement.nativeElement.removeEventListener(
        "dragenter",
        this.onDragEnter.bind(this)
      );
      this.hostElement.nativeElement.removeEventListener(
        "dragleave",
        this.onDragLeave.bind(this)
      );

      this.hostElement.nativeElement.removeEventListener(
        "dragstart",
        this.onDragStart.bind(this)
      );
      this.hostElement.nativeElement.removeEventListener(
        "drop",
        this.onDragDrop.bind(this)
      );
      this.hostElement.nativeElement.removeEventListener(
        "dragend",
        this.onDragEnd.bind(this)
      );

      this.hostElement.nativeElement.removeEventListener(
        "selectstart",
        this.onSelectStart.bind(this)
      );

      this.hostElement.nativeElement.removeEventListener(
        "touchstart",
        this.onTouchStart.bind(this)
      );
      this.hostElement.nativeElement.removeEventListener(
        "touchend",
        this.onTouchEnd.bind(this)
      );
      this.hostElement.nativeElement.removeEventListener(
        "touchmove",
        this.onTouchMove.bind(this)
      );
    });
  }

  ngAfterViewInit() {
    this.draggableItems = this.draggableChildren.map((item) => {
      return item;
    });

    this.draggableChildren.changes.subscribe((changes) => {
      this.draggableItems = changes._results;
    });
  }

  onDragEnter(e) {
    e.preventDefault();
  }

  onDragLeave(e) {
    e.preventDefault();
  }

  onDragStart(e) {
    if (this.dragService.isTouchActive) {
      e.preventDefault();
      return;
    }

    let draggedItem = this.getDraggableItem(e.target);
    if (!draggedItem) {
      e.preventDefault();
      return;
    }

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("Text", e.target.textContent);

    this.dragService.setDraggedItem(draggedItem, this);
  }

  onDragDrop(e) {
    e.preventDefault();
    this.dragService.clearDraggedItem();
  }

  onDragEnd(e) {
    e.preventDefault();
    this.dragService.clearDraggedItem();
  }

  onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();

    // If theres no element dragged then drop the drag event
    if (!this.dragService.draggedItem) {
      return;
    }

    // Update drag target positions
    let target = document.elementFromPoint(e.clientX, e.clientY);

    this.dragAndDrop(target);
  }

  onSelectStart(e) {
    e.preventDefault();
  }

  touchDragTimer = null;
  onTouchStart(e: TouchEvent) {
    this.dragService.isTouchActive = true;
    clearTimeout(this.touchDragTimer);
    this.touchDragTimer = null;

    this.zone.runOutsideAngular(() => {
      this.touchDragTimer = setTimeout(() => {
        let draggedItem = this.getDraggableItem(e.target);
        if (!draggedItem) {
          this.dragService.isTouchActive = false;
          this.touchDragTimer = null;
          e.preventDefault();
          return;
        }

        this.dragService.setDraggedItem(draggedItem, this, true);
        this.dragService.startEmulatedDrag(
          draggedItem,
          this,
          e.touches[0].clientX,
          e.touches[0].clientY
        );
        this.dragService.emulateDrag(
          e.touches[0].clientX,
          e.touches[0].clientY
        );
        this.touchDragTimer = null;
      }, this.touchDragDelay);
    });
  }

  onTouchEnd(e) {
    this.dragService.isTouchActive = false;

    clearTimeout(this.touchDragTimer);
    this.touchDragTimer = null;

    this.dragService.stopEmulatedDrag();
    this.dragService.clearDraggedItem();
  }

  onTouchMove(e) {
    if (this.dragService.isTouchActive && this.touchDragTimer != null) {
      clearTimeout(this.touchDragTimer);
      this.touchDragTimer = null;
      this.dragService.isTouchActive = false;
    }

    if (this.dragService.isTouchActive) {
      e.preventDefault();

      this.dragService.emulateScroll(
        e.touches[0].clientX,
        e.touches[0].clientY
      );
      this.dragService.emulateDrag(e.touches[0].clientX, e.touches[0].clientY);

      let target = document.elementFromPoint(
        e.touches[0].clientX,
        e.touches[0].clientY
      );
      if (!target) return;

      let targetContainer = this.dragService.findContainer(
        (container: DraggableContainer) => {
          return (
            container.getDraggableItem(target) != null ||
            container.hostElement.nativeElement == target
          );
        }
      );

      if (!targetContainer) return;

      if (this.dragService.draggedItemContainer != targetContainer) {
        targetContainer.dragAndDrop(target);
      } else {
        this.dragAndDrop(target);
      }
    }
  }

  dragAndDrop(target) {
    let targetItem = this.getDraggableItem(target);

    if (!targetItem && this.draggableItems.length > 0) return;

    let draggedItem = this.dragService.draggedItem;
    if (!draggedItem) return;

    if (draggedItem.hasAnimation()) return;

    draggedItem.setAnimPosition();
    if (targetItem) {
      targetItem.setAnimPosition();
    }

    if (
      this.containerType != this.dragService.draggedItemContainer.containerType
    )
      return;

    if (this.dragService.draggedItemContainer == this) {
      if (this.draggableOf) {
        let oldIndex = this.draggableOf.indexOf(draggedItem.viewContainer);
        let newIndex = this.draggableOf.indexOf(targetItem.viewContainer);

        if (oldIndex == newIndex) return;

        // No need to manualy move the view ???
        //this.draggableOf.moveView(oldIndex, newIndex);

        this.onSort.emit({
          oldContainer: this.dragService.draggedItemContainer.containerId,
          newContainer: this.containerId,
          oldIndex: oldIndex,
          newIndex: newIndex,
        });

        this.changeDetector.detectChanges();
      }
    }

    if (this.dragService.draggedItemContainer != this) {
      let otherDraggableOf = this.dragService.draggedItemContainer.draggableOf;

      if (otherDraggableOf && this.draggableOf) {
        let oldIndex = otherDraggableOf.indexOf(draggedItem.viewContainer);
        let newIndex = 0;
        if (targetItem) {
          newIndex = this.draggableOf.indexOf(targetItem.viewContainer);
        }

        let detachedView = otherDraggableOf.detachView(oldIndex);
        this.draggableOf.attachView(detachedView, newIndex);

        this.onSort.emit({
          oldContainer: this.dragService.draggedItemContainer.containerId,
          newContainer: this.containerId,
          oldIndex: oldIndex,
          newIndex: newIndex,
        });

        this.dragService.setDraggedItemContainer(this);
        this.changeDetector.detectChanges();
      }
    }

    draggedItem.animateFromPosition(this.animationSpeed);
    if (targetItem) {
      targetItem.animateFromPosition(this.animationSpeed);
    }
  }

  detachView(index: number): ViewRef {
    let view = this.viewContainer.detach(index);
    return view;
  }

  attachView(view: ViewRef, index: number) {
    this.viewContainer.insert(view, index);
  }

  isDraggable(element: Element): boolean {
    if (!element) return false;

    if (element.parentElement == this.hostElement.nativeElement) return true;
    return false;
  }

  getDraggableItem(element) {
    return this.draggableItems.find((item) => {
      if (item.hostElement.nativeElement == element) {
        return true;
      }

      var rootElement = element;
      while (rootElement) {
        if (rootElement == item.hostElement.nativeElement) {
          return true;
        }
        rootElement = rootElement.parentElement;
      }

      return false;
    });
  }

  addElement(element: Element) {}
}
