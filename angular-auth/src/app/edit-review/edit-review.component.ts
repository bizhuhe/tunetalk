import { Component, Input, Output, EventEmitter } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Review, ReviewDataService } from '../review-data.service';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
@Component({
  selector: "app-edit-review",
  templateUrl: "./edit-review.component.html",
  styleUrls: ["../album-detail-page/review-input/review-input.component.css"],
})
export class EditReviewComponent {
  @Input() initialRating: Number | undefined;
  @Input() initialComment: String = "";
  @Input() editMode: boolean = false;
  @Input() review: Review = {} as Review; 
  @Output() reviewSubmitted: EventEmitter<any> = new EventEmitter();
  @Output() collapseForm: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient, private router: Router, private reviewDataService: ReviewDataService) {}

  ngOnInit() {
  
  }
  submitForm(form: NgForm) {
    if (form.valid) {
      const updatedReview = {
        // id: this.review.id,
        id:this.review._id,
        rating: this.review.rating,
        comment: this.review.comment,
      };

      // Call the updateReview method from the parent component
      this.updateReview(updatedReview);
      // Reset the form and emit the reviewSubmitted event
      form.resetForm();
      this.reviewSubmitted.emit(updatedReview);
      this.collapseForm.emit();
      this.initialComment = "";
      this.initialRating = undefined;
   // Navigate to the current route to fetch the updated data
    }
  }

  updateReview(reviewInformation: any) {
    console.log("this review id", this.review._id);

    const updatedReview = {
      ...this.review,
      ...reviewInformation, // Include the updated review data
    };
    this.http
      .put(`http://localhost:3000/reviews/${this.review._id}`, updatedReview, {
        responseType: "text",
      })
      .subscribe((response) => {
        console.log("Review update response: ", response);
      });
      this.reviewDataService.emitReviewUpdated(updatedReview);
  }
}
