import { Component, Output, EventEmitter } from '@angular/core';
import { UserDataService } from '../user-data.service';
import { User } from '../user-data.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-share-review-dialog',
  templateUrl: './share-review-dialog.component.html',
  styleUrls: ['./share-review-dialog.component.css']
})
export class ShareReviewDialogComponent {
  @Output() emailSelected = new EventEmitter<string>();
  constructor(private userDataService: UserDataService, private dialogRef: MatDialogRef<ShareReviewDialogComponent>){}
  users: User[] = [];


  ngOnInit(){
    this.getUserList()
  }
  getUserList(): void {
    this.userDataService.getAllUsers().subscribe(
      (response: User[]) => {
        this.users = response; // assign the response to users array
        console.log(this.users); // log to console to verify
      },
      (error) => {
        console.error('Error occurred while retrieving users:', error);
      }
    );
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
}
