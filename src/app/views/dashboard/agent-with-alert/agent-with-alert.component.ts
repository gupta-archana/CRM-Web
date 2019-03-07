import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agent-with-alert',
  templateUrl: './agent-with-alert.component.html',
  styleUrls: ['./agent-with-alert.component.css']
})
export class AgentWithAlertComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    let self = this;
    window.onscroll = function () { self.scrollFunction() };
  }

  scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      document.getElementById("myBtn").style.display = "block";
    } else {
      document.getElementById("myBtn").style.display = "none";
    }
  }

  // When the user clicks on the button, scroll to the top of the document
  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
}
