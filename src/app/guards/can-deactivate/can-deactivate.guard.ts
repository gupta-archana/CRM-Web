import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { ComponentCanDeactivate } from './component-can-deactivate';
import { CommonFunctionsService } from '../../utils/common-functions.service';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<ComponentCanDeactivate> {
    pressedCount = 0;
    constructor(private commonFunctions: CommonFunctionsService) { }
    canDeactivate(component: ComponentCanDeactivate
    ): boolean {
        if (!component.canDeactivate()) {
            if (this.pressedCount === 1) {
                this.pressedCount = 0;
                return true;
            } else {
                this.commonFunctions.showSnackbar("Press back again to exit");
                this.pressedCount === 1;
                return false;
            }

            // if (!component.canDeactivate()) {
            //     if (confirm("You have unsaved changes! If you leave, your changes will be lost.")) {
            //         return true;
            //     } else {
            //         return false;
            //     }
        }
        return true;
    }
}
