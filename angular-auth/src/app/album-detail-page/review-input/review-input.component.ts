import { Component, EventEmitter, Output, Input } from "@angular/core";
import { AuthorizeService } from "src/app/auth.service";
import { AlbumDataService } from "src/app/album-data.service";
import { HttpClient } from "@angular/common/http";
import { NgForm } from "@angular/forms";
import { Review } from "src/app/review-data.service";
import { ReviewDataService } from "../../review-data.service";
import { InputService } from '../../input.service';

@Component({
  selector: "app-review-input",
  templateUrl: "./review-input.component.html",
  styleUrls: ["./review-input.component.css"],
})
export class ReviewInputComponent {
  @Output() reviewSubmitted: EventEmitter<any> = new EventEmitter();
  album!: any;
  editing = false;
  formSubmitted = false;
  reviewBeingEdited: Review | undefined;

  review: any = {
    user: "",
    userName: "",
    song: "",
    songName: "",
    image: "",
    rating: 0,
    comment: "",
    createdAt: new Date(),
  };

  music: any = {
    id: "",
    musicName: "",
    artists: [],
    image: "",
    popularity: 0,
    release: new Date(),
    reviews: [],
  };

  constructor(
    private albumDataService: AlbumDataService,
    private authorizeService: AuthorizeService,
    private reviewDataService: ReviewDataService,
    private http: HttpClient,
    public inputService: InputService,
  ) {}

  ngOnInit() {
    this.album = this.albumDataService.getAlbum();
    this.music = this.createMusicInformation(this.createReviewInformation());
    this.review = this.createReviewInformation();
  }
  newReviewClick() {
    this.editing = true;
  }

  editReview(currentReview: any) {
    this.inputService.editInput(this, currentReview);
  }

  resetForm(form: NgForm) {
    this.inputService.resetForm(this, form);
  }

  submitForm(form: NgForm) {
    if (form.valid) {
      const reviewInformation = this.createReviewInformation();
      this.createReview(reviewInformation);
      this.formSubmitted = true;
      this.resetForm(form);
      this.reviewSubmitted.emit();
      this.reviewDataService.reviewUpdated.next(reviewInformation);
    }
  }

  createReviewInformation() {
    const reviewInformation = {
      _id: "",
      user: this.authorizeService.email,
      userName: this.authorizeService.userName,
      song: this.album.id,
      songName: this.album.name,
      image: this.album.image,
      rating: this.review.rating,
      comment: this.review.comment,
      likes: 0,
      likedByUsers: [],
      replies: [],
      createdAt: new Date(),
    };
    return reviewInformation;
  }
  createMusicInformation(reviewInformation: any) {
    const musicInformation = {
      id: this.album.id,
      musicName: this.album.name,
      artists: this.album.artists,
      image: this.album.image,
      popularity: this.album.popularity,
      release: this.album.release,
      reviews: [],
    };
    return musicInformation;
  }

  createReview(reviewInformation: any) {
    this.http
      .post<Review>("http://localhost:3000/reviews", reviewInformation)
      .subscribe(
        (newReview) => {
          console.log("Review creation response: ", newReview);
          // add the new review to the review list that's being rendered. 
          this.reviewDataService.handleReviewAdded(newReview);
        },
        (error) => {
          console.error("Error creating review: ", error);
        }
      );
  }
  
  createMusic(musicInformation: any) {
    this.http
      .post("http://localhost:3000/music", musicInformation, {
        responseType: "json",
      })
      .subscribe((response) => {
        console.log("Music creation response:", response);
      });
  }
}
