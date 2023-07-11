import { Component, Inject, Injector, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DialogData } from "../../../Interfaces/DialogData";
import { DataServiceService } from "../../../services/data-service.service";
import { ApiHandlerService } from "../../../utils/api-handler.service";
import { TagModel } from "src/app/models/tag-model";
import { BaseClass } from "src/app/global/base-class";

@Component({
    selector: "app-add-tag",
    templateUrl: "./add-tag.component.html",
    styleUrls: ["./add-tag.component.css"],
})
export class AddTagPopupComponent extends BaseClass implements OnInit {
    tagName: string = "";
    tagModel: Array<TagModel> = [];
    constructor(
        public dialogRef: MatDialogRef<AddTagPopupComponent>,
        private injector: Injector,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        public apiHandler: ApiHandlerService,
        public dataService: DataServiceService
    ) {
        super(injector);
    }

    ngOnInit() {
        this.tagModel = JSON.parse(this.data.message);
    }

    onCancelClick() {
        this.dialogRef.close(false);
    }

    onSaveChangesClick() {
        if (this.tagName.startsWith("#")) {
            this.tagName = this.tagName.slice(1);
        }
        createTag(this);  

    }
}

function createTag(context: AddTagPopupComponent) {
   
    context.apiHandler.createTags(createJsonForAddTag(context), {
        onSuccess(response) {
            context.commonFunctions.showSnackbar("Tag" + " " + context.constants.CREATE_SUCCESS);             
            context.dataService.reloadTagData({data: 'reload'});      
            context.tagName = ""; 
            context.dialogRef.close(true);                      
        }, onError(errorCode, errorMsg) {
            context.commonFunctions.showErrorSnackbar(errorMsg);
        }
    }); 
}

function createJsonForAddTag(context: AddTagPopupComponent) {
    context.tagModel.forEach((item) => {
        item.name = context.tagName;
    });

    let finalJson = [];
    context.tagModel.forEach((item) => {
        const itemJson = {
                "tag": "",
                "attr": item
        }        
        finalJson.push(itemJson);
    });
    
    return finalJson;
}
