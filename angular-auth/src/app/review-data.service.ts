import { EventEmitter, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable,Subscription } from "rxjs";

export interface Review {
  _id: string;
  user: string;
  userName: string;
  song: string;
  songName: string;
  image: string;
  rating: number;
  comment: string;
  likes: number;
  likedByUsers: string[];
  replies: string[];
  createdAt: Date;
}
@Injectable({
  providedIn: "root",
})

export class ReviewDataService {
  public subscription: Subscription = new Subscription();

  ratings: number[];
  reviews: Review[] = [];
  currentAlbumReviews: Review[] =[];
  reviewUpdated: EventEmitter<Review> = new EventEmitter<Review>();
  constructor(private http: HttpClient) {}

  getAllReviews(): Observable<Review[]> {
    return this.http.get<Review[]>("http://localhost:3000/reviews");
  }

  // get all the reviews for the selected music album
  getAllReviewsForCurrentAlbum(id: string): Observable<Review[]> {
    return this.http.get<Review[]>(`http://localhost:3000/music/${id}/reviews`);

}

  //fetch all the reviews for the current user
  getAllReviewsForCurrentUser(id: string): Observable<Review[]> {
    const url = `http://localhost:3000/user/${id}/reviews`;
    return this.http.get<Review[]>(url);
  }
  deleteReview(id: String): Observable<any> {
    return this.http.delete(`http://localhost:3000/reviews/${id}`);
  }
  editReview(id: string, updatedReview: any): Observable<any> {
    return this.http.put(`http://localhost:3000/reviews/${id}`, updatedReview);
  }
  likeReview(id: string, userEmail: string): Observable<any> {
    console.log("from the services", userEmail);
    return this.http.put(`http://localhost:3000/reviews/${id}/like`, { userEmail });
  }

  
  // this method is created to serve the rendering of the stars in the reviews
  getStars(rating: number): boolean[] {
    const filledStarsCount = Math.floor(rating);
    const emptyStarsCount = 5 - filledStarsCount;

    const stars: boolean[] = [];
    for (let i = 0; i < filledStarsCount; i++) {
      stars.push(true);
    }
    for (let i = 0; i < emptyStarsCount; i++) {
      stars.push(false);
    }

    return stars;
  }

  emitReviewUpdated(review: Review) {
    this.reviewUpdated.emit(review);
  }

  listenForSSEUpdates(): Observable<Review> {
    console.log("Calling SSE updates");
    const url = "http://localhost:3000/sse/stream";

    return new Observable<Review>((observer) => {
      const eventSource = new EventSource(url);

      eventSource.onopen = () => {
        // console.log("SSE connection established");
      };

      eventSource.onmessage = (event: MessageEvent) => {
        const data: Review = JSON.parse(event.data);
        // console.log("Received SSE event:", data);
        observer.next(data);
      };

      eventSource.onerror = (error) => {
        console.error("SSE connection error:", error);
        observer.error(error);
      };

      return () => {
        eventSource.close();
      };
    });
  }
  handleReviewUpdated(updatedReview: Review) {
    const index = this.reviews.findIndex(
      (review) => review._id === updatedReview._id
    );
    if (index !== -1) {
      this.reviews[index] = updatedReview;
      this.emitReviewUpdated(updatedReview);
    }
}


  handleReviewAdded(newReview: Review) {
    this.reviews.unshift(newReview); // Adds the new review to the start of the list
  }

  handleReviewDeleted(deletedReview: Review) {
    // console.log("Review deleted:", deletedReview);
    const index = this.reviews.findIndex(
      (review) => review._id === deletedReview._id
    );
    if (index !== -1) {
      this.reviews.splice(index, 1); // Removes the review from the list
    }
  }
  shareReview(
    createReview: Review,
    data: { recipient: string; subject: string; text: string }
  ): Observable<any> {
    return this.http.post("http://localhost:3000/reviews/share", {
      createReview,
      data,
    });
  }
  subscribeToReviewUpdates(): void {
    this.subscription = this.reviewUpdated.subscribe(
      (updatedReview: Review) => {
        const index = this.reviews.findIndex(
          (review) => review._id === updatedReview._id
        );
        if (index !== -1) {
          this.reviews[index] = updatedReview;
        }
      }
    );
  }
  loadReviews(userId: string) {
    this.getAllReviewsForCurrentUser(userId).subscribe(
      (response: Review[] | any) => {
        if (Array.isArray(response)) {
          this.reviews = [
            ...response
              .map((review) => {
                return {
                  ...review,
                  createdAt: new Date(review.createdAt),
              }
            })
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
          ];
          console.log("the reviews ", response);
        } else {
          console.error("Unexpected response: ", response);
        }
      },
    );
  }

}
