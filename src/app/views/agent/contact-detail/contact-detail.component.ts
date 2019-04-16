import { Component, OnInit, Injector } from '@angular/core';
import { CommonFunctionsService } from '../../../utils/common-functions.service';
import { BaseClass } from '../../../global/base-class';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent extends BaseClass implements OnInit {
  deviceInfo = null;
  constructor(private injector: Injector,
    private deviceService: DeviceDetectorService) {
    super(injector);
  }

  ngOnInit() {
  }
  goBack() {
    this.commonFunctions.backPress();
  }

  private doEmail() {
    var mailContent = "mailto:adam.millendorf@outlook.com?cc=divyanshu@jklm.com&bcc=div@jkm.com&subject=subject&body=" + encodeURIComponent("<b>Hello I am body</b>");
    window.location.href = mailContent;
  }

  private doCall() {
    var call = "tel:720-434-1417";
    window.location.href = call;
  }

  private doSMS() {
    var call = "sms:720-434-1417";
    window.location.href = call;
  }

  copyText(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.commonFunctions.showSnackbar("Copied");
  }

  epicFunction() {
    console.log('hello `Home` component');
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    console.log(this.deviceInfo);
    console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
    console.log(isTablet);  // returns if the device us a tablet (iPad etc)
    console.log(isDesktopDevice); // returns if the app is running on a Desktop browser.
  }
}
