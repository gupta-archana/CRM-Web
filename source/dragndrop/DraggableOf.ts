import { Directive,	Input, DoCheck, OnChanges, EmbeddedViewRef,  IterableChangeRecord, IterableChanges, IterableDiffer, IterableDiffers, SimpleChanges, TemplateRef, ViewRef, ViewContainerRef, forwardRef, isDevMode} from '@angular/core';
import { NgForOfContext } from "@angular/common";

interface TrackByFunction<T> { (index: number, item: T): any; }

@Directive({selector: "[draggableFor][draggableForOf]"})
export class DraggableOf<T> implements DoCheck, OnChanges 
{

	@Input()
	draggableForOf: Array<T>| Iterable<T>;

	@Input()
	set draggableForTrackBy(fn: TrackByFunction<T>)
	{
		if (isDevMode() && fn != null && typeof fn !== 'function')
		{
			// TODO(vicb): use a log service once there is a public one available
			if (<any>console && <any>console.warn)
			{
				console.warn(
					`trackBy must be a function, but received ${JSON.stringify(fn)}. ` +
					`See https://angular.io/docs/ts/latest/api/common/index/NgFor-directive.html#!#change-propagation for more information.`
				);
			}
		}
		this._trackByFn = fn;
	}

	get draggableForTrackBy(): TrackByFunction<T>
	{
		return this._trackByFn;
	}

	private _differ: IterableDiffer<T>|null = null;
	private _trackByFn: TrackByFunction<T>;

	constructor(
		public ViewContainer: ViewContainerRef,
		private _template: TemplateRef<NgForOfContext<T>>,
		private _differs: IterableDiffers
	)
	{

	}

	@Input()
	set draggableForTemplate(value: TemplateRef<NgForOfContext<T>>)
	{
		// TODO(TS2.1): make TemplateRef<Partial<NgForRowOf<T>>> once we move to TS v2.1
		// The current type is too restrictive; a template that just uses index, for example,
		// should be acceptable.
		if (value)
		{
			this._template = value;
		}
	}

	ngOnChanges(changes: SimpleChanges): void
	{
		if ('draggableForOf' in changes)
		{
			// React on ngForOf changes only once all inputs have been initialized
			const value = changes['draggableForOf'].currentValue;
			if (!this._differ && value)
			{
				try {
					this._differ = this._differs.find(value).create(this.draggableForTrackBy);
				} catch (e)
				{
					throw new Error(`Cannot find a differ supporting object '${value}' of type '${getTypeNameForDebugging(value)}'. draggableFor only supports binding to Iterables such as Arrays.`);
				}
			}
		}
	}

	ngDoCheck(): void
	{
		if (this._differ)
		{
			const changes = this._differ.diff(this.draggableForOf);
			if (changes)
				this._applyChanges(changes);
		}
	}

	createView(data:any, index): EmbeddedViewRef<NgForOfContext<T>>
	{
		const view = this.ViewContainer.createEmbeddedView(
			this._template,
			new NgForOfContext<T>(null !, this.draggableForOf, -1, -1),
			index
		);
		view.context.$implicit = data;
		return view;
	}

	getView(index): ViewRef
	{
		return this.ViewContainer.get(index);
	}

	dettachments = [];
	detachView(index: number): ViewRef
	{
		let view = this.ViewContainer.detach(index);
		this.dettachments.push(index);
		this.attachments.splice(this.attachments.indexOf(index), 1);
		return view;
	}

	attachments = [];
	attachView(view: ViewRef, index: number)
	{
		let template = (<any>this._template);
		let parentNodeDef = template._def;
		let parent = template._parentView;
		let viewRef = (<any>view);
		
		viewRef._view.root = parent.root;
		viewRef._view.parent = parent;
		viewRef._view.renderer = parent.renderer;
		viewRef._view.parentNodeDef = template._def;
		viewRef._view.state = 1 << 0;

		this.ViewContainer.insert(viewRef, index);

		this.attachments.push(index);
		this.dettachments.splice(this.dettachments.indexOf(index), 1);
		
	}

	moves = [];
	moveView(oldIndex, newIndex)
	{
		let view = this.ViewContainer.get(oldIndex);
		if(!view)
			return;

		this.ViewContainer.move(view, newIndex);

		this.moves.push({
			oldIndex: oldIndex,
			newIndex: newIndex
		});
	}

	indexOf(viewRef: any): number
	{
		return this.ViewContainer.indexOf(viewRef);
	}

	_applyChanges(changes: IterableChanges<T>)
	{
	
		changes.forEachOperation((item: IterableChangeRecord<any>, adjustedPreviousIndex: number, currentIndex: number) => {

			if (item.previousIndex == null)
			{
				if(!this.attachments.includes(currentIndex))
				{
					this.createView(item.item, currentIndex);	
				}
			} else if (currentIndex == null)
			{
				if(!this.dettachments.includes(adjustedPreviousIndex))
				{
					this.ViewContainer.remove(adjustedPreviousIndex);
				}
			} else {
				const view = this.ViewContainer.get(adjustedPreviousIndex) !;
				this.ViewContainer.move(view, currentIndex);
			}
		});
		
		this.dettachments = [];
		this.attachments = [];
		this.moves = [];
		for (let i = 0, ilen = this.ViewContainer.length; i < ilen; i++)
		{
			const viewRef = <EmbeddedViewRef<NgForOfContext<T>>>this.ViewContainer.get(i);
			viewRef.context.index = i;
			viewRef.context.count = ilen;
		}

		changes.forEachIdentityChange((record: any) => {
			const viewRef = <EmbeddedViewRef<NgForOfContext<T>>>this.ViewContainer.get(record.currentIndex);
			viewRef.context.$implicit = record.item;
		});
	}


}

export class RecordViewTuple<T>
{
	constructor(public record: any, public view: EmbeddedViewRef<NgForOfContext<T>>)
	{}
}

function getTypeNameForDebugging(type: any): string
{
	return type['name'] || typeof type;
}