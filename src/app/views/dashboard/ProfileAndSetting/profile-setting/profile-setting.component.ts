import { Component, OnInit, Injector } from '@angular/core';
import { BaseClass } from '../../../../global/base-class';

@Component({
  selector: 'app-profile-setting',
  templateUrl: './profile-setting.component.html',
  styleUrls: ['./profile-setting.component.css']
})
export class ProfileSettingComponent extends BaseClass implements OnInit {

  constructor(private injector: Injector) { super(injector); }

  ngOnInit() {

  }
  onEditProfilePicClick() {
    const dialogRef = this.openDialogService.showChangePicDialog();
    dialogRef.afterClosed().subscribe(callback => {

    });
  }
  onEditProfileClick() {
    this.dataService.onAgentProfileEditClick(true);
  }
}
