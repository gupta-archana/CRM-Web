import { BaseClass } from "./base-class";
import { Injector } from "@angular/core";

export class EntityDetailBaseClass extends BaseClass {
    private entityArray: Array<any> = [];
    constructor(private injector: Injector) {
        super(injector);
    }

    protected addNewHistoryEntity(entityObject: any) {
        this.entityArray = JSON.parse(sessionStorage.getItem(this.constants.ENTITY_ARRAY));
        if (!this.entityArray)
            this.entityArray = [];
        this.entityArray = filterAndPushNewItemInArray(this.entityArray, entityObject);
        sessionStorage.setItem(this.constants.ENTITY_ARRAY, JSON.stringify(this.entityArray));
    }

    protected getHistoryEntityArray(): Array<any> {
        return JSON.parse(sessionStorage.getItem(this.constants.ENTITY_ARRAY));
    }

}
function filterAndPushNewItemInArray(array: Array<any>, currentElement: any) {
    let tempArray = array;
    tempArray.every((element, index) => {
        if (element.entityId == currentElement.entityId) {
            array.splice(index, 1);
            return false;
        }
        return true;
    });
    array.unshift(currentElement);
    return array;
}
