import { ComponentCanDeactivate } from "../can-deactivate/component-can-deactivate";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
// import { Directive as  } from "@angular/core";

// @Directive()
export abstract class FormCanDeactivate extends ComponentCanDeactivate {
    // abstract get form(): NgForm;

    canDeactivate(): boolean {
        return false;
    }
}
