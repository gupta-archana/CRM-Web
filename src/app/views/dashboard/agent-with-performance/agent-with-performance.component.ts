import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agent-with-performance',
  templateUrl: './agent-with-performance.component.html',
  styleUrls: ['./agent-with-performance.component.css']
})
export class AgentWithPerformanceComponent implements OnInit {

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
