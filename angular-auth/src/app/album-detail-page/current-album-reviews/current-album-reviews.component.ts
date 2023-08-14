import { Component } from "@angular/core";
import { Review } from "src/app/review-data.service";
import { ReviewDataService } from "src/app/review-data.service";
import { AlbumDataService } from "../../album-data.service";
import { Subscription } from "rxjs";
import { UserDataService } from "../../user-data.service";

@Component({
  selector: "app-current-album-reviews",
  templateUrl: "./current-album-reviews.component.html",
  styleUrls: ["./current-album-reviews.component.css"],
})
export class CurrentAlbumReviewsComponent {
  album!: any;
  currentAlbumId: string = "";
  user: any;
  reviews: Review[] | undefined = undefined;

  public subscription: Subscription = new Subscription();
  constructor(
    public reviewDataService: ReviewDataService,
    private albumDataService: AlbumDataService,
    private userDataService: UserDataService
  ) {}
  ngOnInit() {
    // this.reviews = this.reviewDataService.currentAlbumReviews;
    this.album = this.albumDataService.getAlbum();
    this.currentAlbumId = this.album.id;
    this.loadCurrentAlbumReviews();
    this.reviewDataService.subscribeToReviewUpdates();
  }
  handleEditingChange(editing: any) {
    if (!editing) {
      this.subscription.unsubscribe();
    }
  }
  // when navigating to a new page, destroy the local storage--reviews retrieved from previous album
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  onUserClick(email: string) {
    this.userDataService.openPersonalPage(email);
  }

  // get all the reviews for the current album at display
  loadCurrentAlbumReviews() {
    this.reviewDataService
      .getAllReviewsForCurrentAlbum(this.currentAlbumId)
      .subscribe((response: Review[]) => {
        this.reviewDataService.reviews = response
          .map((review) => {
            return {
              ...review,
              createdAt: new Date(review.createdAt),
            };
          })
          
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
         
      });
    (error: any) => {
      console.error("Error occurred:", error);
    };
  }

}
