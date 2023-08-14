
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthorizeService } from '../auth.service';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['../confirm-dialog/confirm-dialog.component.css']
})
export class LoginDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    private authorizeService: AuthorizeService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  login() {
    this.authorizeService.login();
  }
}
