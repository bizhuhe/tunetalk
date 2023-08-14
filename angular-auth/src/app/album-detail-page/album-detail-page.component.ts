import { Component } from "@angular/core";
import { AuthorizeService } from "../auth.service";
import { LoginDialogComponent } from "../login-dialog/login-dialog.component";
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: "app-album-detail-page",
  templateUrl: "./album-detail-page.component.html",
  styleUrls: ["./album-detail-page.component.css"],
})
export class AlbumDetailPageComponent {
  album: any;
  songId: string = "";
  showReviewInput: boolean = false;

  constructor(
    private authorizeService: AuthorizeService,
    private dialog : MatDialog,
  ) {}

  openReviewInput() {
    if (this.authorizeService.isAuthenticated) {
      this.showReviewInput = !this.showReviewInput;
    } else {
      this.openLoginDialog();
    }
  }


  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      data : {
        dialogMessage: 'Please login to create a review'
      }
    });
  }
  

  hideReviewInput() {
    this.showReviewInput = false;
  }
}
