import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from "@angular/core";
import { Review, ReviewDataService } from "../review-data.service";
import { AuthorizeService } from "../auth.service";
import { Router, NavigationStart } from "@angular/router";
import { UserDataService } from "../user-data.service";
import { AlbumDataService } from "../album-data.service";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";
import { ShareReviewDialogComponent } from "../share-review-dialog/share-review-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { ConfigurationService } from "angular-auth-oidc-client";
import { LoginDialogComponent } from "../login-dialog/login-dialog.component";
import { HttpClient } from "@angular/common/http";
import { Reply } from "./reply-input/reply-input.component";

@Component({
  selector: "app-review-tile",
  templateUrl: "./review-tile.component.html",
  styleUrls: ["./review-tile.component.css"],
})
export class ReviewTileComponent {
  @Input() review!: Review;
  @Input() currentUser!: string;

  @Output() reviewSubmitted: EventEmitter<Review> = new EventEmitter<Review>();
  @Output() reviewDeleted: EventEmitter<void> = new EventEmitter<void>();
  @Output() editingChange = new EventEmitter<any>();
  @Input() displayAlbumInfo: boolean = true;

  initialRating: number = 0;
  initialComment: string = "";
  editing = false;
  album: any;
  currentUserLiked: boolean = false;
  showReplyInput: boolean = false;
  totalReplies: number = 0;

  constructor(
    public authorizeService: AuthorizeService,
    public reviewDataService: ReviewDataService,
    public userDataService: UserDataService,
    public albumDataService: AlbumDataService,
    public dialog: MatDialog,
    public router: Router,
    public configuration: ConfigurationService,
    private http: HttpClient
  ) {
  }


  ngOnInit() {
    this.checkEditingStatus();
    this.initializeReviewData();
    this.logOpenIDConfigurations();
    this.getTotalReplies();
    this.setupRouterEventSubscription();
    
  }
  setupRouterEventSubscription(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.editing = false; // Reset the editing state when navigating away
        this.editingChange.emit(this.editing);
        localStorage.removeItem("editing"); // Remove the value from local storage
      }
    });
  }

getTotalReplies(){
  if (!this.review?._id) {
    console.error('Review ID is undefined');
    return;
  }
  this.http.get<Reply[]>(`http://localhost:3000/reply/${this.review._id}`).subscribe(
    replies => {
      this.totalReplies = replies.length;
    },
    error => {
      console.error('Error getting replies:', error);
    }
  );
}

  handleTotalReplies(total: number) {
    this.totalReplies = total;
  }
  
  checkEditingStatus() {
    if (localStorage.getItem("editing")) {
      const editingValue = localStorage.getItem("editing");
      if (editingValue === "true") {
        this.editing = true;
        this.editingChange.emit(this.editing);
      }
    }
  }

  initializeReviewData() {
    this.initialRating = this.review?.rating;
    this.initialComment = this.review?.comment;
  }

  logOpenIDConfigurations() {
    // Add a check for 'configuration' before accessing its properties
    this.configuration.getOpenIDConfigurations().subscribe((config) => {
      const configId = config.currentConfig?.configId;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["review"]) {
      // Perform update operation on review
      // This block will be executed whenever the review object updates
      this.review = changes["review"].currentValue;
    }
  }
  clickReply() {
    if (this.authorizeService.isAuthenticated) {
      this.showReplyInput = !this.showReplyInput;
    } else {
      this.dialog.open(LoginDialogComponent, {
        data: {
          dialogMessage: 'Please login to see more replies, and you can create one your own'
        }
      });
    }
  }

  shareReview(review: Review) {
    const dialogRef = this.dialog.open(ShareReviewDialogComponent, {
      width: "350px",
    });
    dialogRef.componentInstance.emailSelected.subscribe(
      (selectedEmail: string) => {
        this.sendReviewEmail(review, selectedEmail);
        dialogRef.close();
      }
    );
  }

  sendReviewEmail(review: Review, selectedEmail: string) {
    const data = {
      createdReview: review,
      recipient: selectedEmail,
      subject: "Review Sharing",
      text: "Please check out this review:",
    };
    this.reviewDataService.shareReview(review, data).subscribe(
      () => {
        console.log("Email sent successfully");
      },
      (error) => {
        console.error("Error sending email:", error);
      }
    );
  }

  deleteReview(reviewId: String) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "350px",
      data: "Are you sure you want to delete this review?",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // delete the selected review
        this.reviewDataService.deleteReview(reviewId).subscribe(
          (response) => {
            this.reviewDeleted.emit();
          },
          (error) => {
            console.log("Error occurred while deleting review:", error);
          }
        );
      }
    });
  }



  editReview(reviewId: String) {
    this.editing = true;
    this.editingChange.emit(this.editing);
    localStorage.setItem("editing", "true");
  }

  handleReviewEdited(editedReview: Review) {
    // Update the current review object with the data from the edited review
    this.review = editedReview;
    // Set editing to false to hide the form
    this.editing = false;
    // remove the edit status from local storage to prevent from it returning a true value
    localStorage.removeItem("editing");
  }
  likeReview() {
    if (this.authorizeService.isAuthenticated) {
    this.reviewDataService
      .likeReview(this.review._id, this.authorizeService.currentUser.email)
      .subscribe(
        (res) => {
          this.currentUserLiked = res.userLiked;
          if (this.currentUserLiked) {
            this.review.likes += 1;
          } else {
            this.review.likes -= 1;
          }
        },
        (err) => console.error("Failed to like the review:", err)
      );
      } else {
        this.dialog.open(LoginDialogComponent, {
          data: {
            dialogMessage: 'Please login to like a review'
          }
        });
      }
  }
  hideReviewInput() {
    this.editing = false;
    // remove the edit status from local storage to prevent from it returning a true value
    localStorage.removeItem("editing");
  }
  onUserClick(email: string) {
    this.userDataService.openPersonalPage(email);
  }

  onAlbumClick(song: string) {
    this.albumDataService.getAlbumById(this.review.song).subscribe(
      (album: any) => {
        this.album = album;
        this.albumDataService.setAlbum(this.album);
        this.router.navigate(["/album-details", song], {
          state: { album: this.album },
        });
      },
      (error) => {
        console.error("Error occurred while retrieving album:", error);
      }
    );
  }
}
