import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../../global/base-class';
import { ApiResponseCallback } from '../../../Interfaces/ApiResponseCallback';

@Component({
  selector: 'app-agent-tags',
  templateUrl: './agent-tags.component.html',
  styleUrls: ['./agent-tags.component.css']
})
export class AgentTagsComponent extends BaseClass implements OnInit, ApiResponseCallback {

  constructor(private injector: Injector) { super(injector) }

  ngOnInit() {
  }
  onSuccess(response: any) {
    throw new Error("Method not implemented.");
  }
  onError(errorCode: number, errorMsg: string) {
    throw new Error("Method not implemented.");
  }

}
