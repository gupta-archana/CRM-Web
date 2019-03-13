import { Component, OnInit } from '@angular/core';
import { CommonFunctionsService } from '../../../utils/common-functions.service';

@Component({
  selector: 'app-agent-objective',
  templateUrl: './agent-objective.component.html',
  styleUrls: ['./agent-objective.component.css']
})
export class AgentObjectiveComponent implements OnInit {

  constructor(private commonFunctions: CommonFunctionsService) { }

  ngOnInit() {
  }
  goBack() {
    this.commonFunctions.backPress();
  }
}
