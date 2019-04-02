import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-forgot-password-alert',
  templateUrl: './forgot-password-alert.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordAlertComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ForgotPasswordAlertComponent>, ) { }

  onLoginClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }

}
