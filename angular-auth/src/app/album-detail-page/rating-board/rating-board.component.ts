import { Component } from "@angular/core";
import { AlbumDataService } from "../../album-data.service";
import { ReviewDataService } from "src/app/review-data.service";
import { Subscription } from "rxjs";
import { Review } from "src/app/review-data.service";
import { Observable, map, tap } from "rxjs";

@Component({
  selector: "app-rating-board",
  templateUrl: "./rating-board.component.html",
  styleUrls: ["./rating-board.component.css"],
})
export class RatingBoardComponent {
  album: any;
  currentAlbumId: string = "";
  ratings: number[];
  numberOfRatings: number;
  averageRating: string;
  reviews: Review[] | undefined = undefined;
  percentageOneStar: string = "0%";
  percentageTwoStars: string = "0%";
  percentageThreeStars: string = "0%";
  percentageFourStars: string = "0%";
  percentageFiveStars: string = "0%";
  ratings$: Observable<number[]>;

  public subscription: Subscription = new Subscription();
  constructor(
    private albumDataService: AlbumDataService,
    private reviewDataService: ReviewDataService
  ) {}
  ngOnInit() {
    this.album = this.albumDataService.getAlbum();
    this.currentAlbumId = this.album.id;
    this.loadCurrentAlbumRatings();
    this.getWidth();
  }

  // get all the ratings for the current album on display,
  // calculate the average, and show the percentage of each rating category
  loadCurrentAlbumRatings() {
    this.reviewDataService
      .getAllReviewsForCurrentAlbum(this.currentAlbumId)
      .subscribe((response: Review[]) => {
        this.ratings = response.map((review) => review.rating);
        this.getAverageRating();
        this.getStarPercentage();
      });
  }
  getAverageRating() {
    this.numberOfRatings = this.ratings.length;
    const total = this.ratings.reduce((sum, rating) => sum + rating, 0);
    if (this.ratings.length === 0) {
      this.averageRating = "0%";
    } else {
      this.averageRating = ((total * 2) / this.ratings.length).toFixed(1);
    }
  }
  getStarPercentage() {
    let fiveStars = 0,
      fourStars = 0,
      threeStars = 0,
      twoStars = 0,
      oneStar = 0;
    for (let rating of this.ratings) {
      if (rating === 1) {
        oneStar += 1;
      } else if (rating === 2) {
        twoStars += 1;
      } else if (rating === 3) {
        threeStars += 1;
      } else if (rating === 4) {
        fourStars += 1;
      } else if (rating === 5) {
        fiveStars += 1;
      }
    }
    const totalRatings = this.ratings.length;
    if (totalRatings === 0) {
      this.percentageOneStar = "0%";
      this.percentageTwoStars = "0%";
      this.percentageThreeStars = "0%";
      this.percentageFourStars = "0%";
      this.percentageFiveStars = "0%";
    } else {
      this.percentageOneStar =
        ((oneStar / totalRatings) * 100).toFixed(1) + "%";
      this.percentageTwoStars =
        ((twoStars / totalRatings) * 100).toFixed(1) + "%";
      this.percentageThreeStars =
        ((threeStars / totalRatings) * 100).toFixed(1) + "%";
      this.percentageFourStars =
        ((fourStars / totalRatings) * 100).toFixed(1) + "%";
      this.percentageFiveStars =
        ((fiveStars / totalRatings) * 100).toFixed(1) + "%";
    }
  }
  getWidth() {
    console.log(this.percentageFiveStars);
    return this.percentageFiveStars + "%";
  }
}
