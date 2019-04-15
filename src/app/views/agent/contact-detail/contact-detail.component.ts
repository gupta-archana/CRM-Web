import { Component, OnInit } from '@angular/core';
import { CommonFunctionsService } from '../../../utils/common-functions.service';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {

  constructor(private commonFunctions: CommonFunctionsService) { }

  ngOnInit() {
  }
  goBack() {
    this.commonFunctions.backPress();
  }

  private doEmail() {
    var mailContent = "mailto:adam.millendorf@outlook.com?cc=divyanshu@jklm.com&bcc=div@jkm.com&subject=subject&body=" + encodeURIComponent("<b>Hello I am body</b>");
    window.location.href = mailContent;
  }
}
