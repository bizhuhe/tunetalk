import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ReviewDataService } from "./review-data.service";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { Review } from "./review-data.service";
import { EventEmitter } from '@angular/core';
import { of } from "rxjs";


describe("ReviewDataService", () => {
  let service: ReviewDataService;
  let httpMock: HttpTestingController;
  let updatedReview: Review;
  let nonExistingReview: any;
  const mockReview1 = {
    _id: "mockReview1",
    user: "mockUser1",
    userName: "Mock User1",
    song: "mockSongId",
    songName: "Mock Song",
    image: "mock-image.png",
    rating: 5,
    comment: "this is mock review 1",
    likes: 2,
    likedByUsers: [],
    replies: [],
    createdAt: new Date(),
  };

  const mockReview2 = {
    _id: "mockReview2",
    user: "mockUser2",
    userName: "Mock User2",
    song: "mockSongId",
    songName: "Mock Song",
    image: "mock-image.png",
    rating: 4,
    likes: 3,
    likedByUsers: [],
    replies: [],
    comment: "this is mock review 2",
    createdAt: new Date(),
  };
  const mockReviewForOperation: Review = {
    _id: "mockReview3",
    user: "mockUser3",
    userName: "Mock User3",
    song: "mockSongId1",
    songName: "Mock Song1",
    image: "mock-image1.png",
    rating: 2,
    likes: 4,
    likedByUsers: [],
    replies: [],
    comment: "this is mock review 3",
    createdAt: new Date(),
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [ReviewDataService],
    });
    service = TestBed.inject(ReviewDataService);
    httpMock = TestBed.inject(HttpTestingController);
    updatedReview = {
      ...mockReview2,
      comment: "updated comment",
    };
    nonExistingReview = {
    };
  });
  afterEach(() => {
    httpMock.verify();
  });
  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should get all reviews", () => {
    const mockReviews: Review[] = [mockReview1, mockReview2];

    service.getAllReviews().subscribe((reviews) => {
      expect(reviews).toEqual(mockReviews);
    });

    const req = httpMock.expectOne("http://localhost:3000/reviews");
    expect(req.request.method).toBe("GET");
    req.flush(mockReviews);
  });

  it("should get all reviews for current user", () => {
    const userId = "mockUserId";
    const mockReviews: Review[] = [mockReview1, mockReview2];

    service.getAllReviewsForCurrentUser(userId).subscribe((reviews) => {
      expect(reviews).toEqual(mockReviews);
    });

    const req = httpMock.expectOne(
      `http://localhost:3000/user/${userId}/reviews`
    );
    expect(req.request.method).toBe("GET");
    req.flush(mockReviews);
  });

  it("should delete the review", () => {
    const mockReviews: Review[] = [mockReview1, mockReview2];
    service.deleteReview(mockReview2._id).subscribe(() => {});
    const req = httpMock.expectOne(
      `http://localhost:3000/reviews/${mockReview2._id}`
    );
    expect(req.request.method).toBe("DELETE");
    req.flush(mockReviews);
  });
  it("should edit the review", () => {
    const mockReviews: Review[] = [mockReview1, mockReview2];
    const updatedReview: Review = {
      ...mockReview2,
      comment: "updated comment",
    };

    service.editReview(mockReview2._id, updatedReview).subscribe((response) => {
      expect(response.comment).toBe("updated comment");
    });

    const req = httpMock.expectOne(
      `http://localhost:3000/reviews/${mockReview2._id}`
    );
    expect(req.request.method).toBe("PUT");
    // Check if the updated review was sent correctly
    expect(req.request.body).toEqual(updatedReview);

    // Return the updated review as the mock response
    req.flush(updatedReview);
  });

  it("should handle updated review correctly", () => {
    const mockReviews: Review[] = [mockReview1, mockReview2];
    const updatedReview: Review = {
      ...mockReview2,
      comment: "updated comment",
    };

    service["reviews"] = mockReviews;
    service.handleReviewUpdated(updatedReview);
    const index = service["reviews"].findIndex(
      (review) => review._id === updatedReview._id
    );

    // Check that the review at the found index matches the updated review
    expect(service["reviews"][index]).toEqual(updatedReview);
  });

  it("should handle added review correctly", () => {
    service["reviews"] = [mockReview1, mockReview2];

    service.handleReviewAdded(mockReviewForOperation);
    expect(service["reviews"].length).toEqual(3);
  });

  it("should handle deleted review correctly", () => {
    const mockReviews: Review[] = [
      mockReview1,
      mockReview2,
      mockReviewForOperation,
    ];
    service["reviews"] = mockReviews;
    service.handleReviewDeleted(mockReviewForOperation);
    const index = service["reviews"].findIndex(
      (review) => review._id === mockReviewForOperation._id
    );

    // Check that the review at the found index matches the updated review
    expect(service["reviews"].length).toEqual(2);
  });

  it("should get stars correctly", () => {
    const fiveStars = service.getStars(5);
    expect(fiveStars).toEqual([true, true, true, true, true]);
    const zeroStars = service.getStars(0);
    expect(zeroStars).toEqual([false, false, false, false, false]);
    let threeStars = service.getStars(3);
    expect(threeStars).toEqual([true, true, true, false, false]);
  });

  it("should update the review when reviewUpdated is emitted", () => {
    service["reviews"] = [mockReview1, mockReview2];
    service.reviewUpdated = new EventEmitter<Review>();
    service.subscribeToReviewUpdates();
    updatedReview.comment = "Updated comment";
    service.reviewUpdated.emit(updatedReview);
    expect(service['reviews'][1]).toEqual(updatedReview);
  });

  it("should not update the review array if updated review ID is not found", () => {
    service.reviewUpdated = new EventEmitter<Review>();
    service.subscribeToReviewUpdates();
    service.reviewUpdated.emit(nonExistingReview);
    expect(service['reviews'].find(r => r._id === nonExistingReview._id)).toBeUndefined();
  });

  it("should load reviews for current user and sort them by creation date", () => {

    const userId = "mockUserId";
    const unsortedReviews: Review[] = [
      { ...mockReview1, createdAt: new Date('2023-08-02') },
      { ...mockReview2, createdAt: new Date('2023-08-01') }
    ];

    const sortedReviews: Review[] = [
      { ...mockReview1, createdAt: new Date('2023-08-02') },
      { ...mockReview2, createdAt: new Date('2023-08-01') }
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  
    spyOn(service, 'getAllReviewsForCurrentUser').and.returnValue(of(unsortedReviews));
      service.loadReviews(userId);
    expect(service['reviews']).toEqual(sortedReviews);
  });
  

});
