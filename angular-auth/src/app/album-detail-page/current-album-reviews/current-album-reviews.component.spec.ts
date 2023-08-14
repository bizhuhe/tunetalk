import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CurrentAlbumReviewsComponent } from "./current-album-reviews.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AlbumDataService } from "src/app/album-data.service";
import { ReviewDataService } from "src/app/review-data.service";
import { UserDataService } from "src/app/user-data.service";
import { of, Subject, Subscription} from "rxjs";
import { ReviewTileComponent } from "src/app/review-tile/review-tile.component";
import {
  StsConfigLoader,
} from "angular-auth-oidc-client";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
describe("CurrentAlbumReviewsComponent", () => {
  let component: CurrentAlbumReviewsComponent;
  let fixture: ComponentFixture<CurrentAlbumReviewsComponent>;
  let mockAlbumDataService: any;
  let mockReviewDataService: any;
  let mockUserDataService: any;
  let mockStsConfigLoader;
  const mockReview = {
    id: "mockId",
    user: "mockUserId",
    userName: "Mock User",
    song: "mockSongId",
    songName: "Mock Song",
    image: "mock-image.png",
    rating: 1,
    comment: "This is a mock review",
    createdAt: new Date(),
  };
  const mockAlbum = {
    id: "1",
    name: "Album Name",
    artists: ["some singer"],
    image: "Album Image",
    popularity: 59,
    release: new Date(),
    reviews: [],
  };
  mockStsConfigLoader = {
    loadConfigs: jasmine.createSpy("loadConfigs").and.returnValue(
      of({
        clientId: "mockClientId",
        server: "mockServer",
        redirectUrl: "mockRedirectUrl",
      })
    ),
  };
  mockAlbumDataService = {
    getAlbum: jasmine.createSpy("getAlbum").and.returnValue(mockAlbum),
  };
  mockReviewDataService = {
    subscribeToReviewUpdates: jasmine.createSpy('subscribeToReviewUpdates').and.returnValue(new Subject()),
    getAllReviewsForCurrentAlbum: jasmine
      .createSpy("getAllReviewsForCurrentAlbum")
      .and.returnValue(of([mockReview])),
    currentAlbumReviews: [mockReview],
    getStars: jasmine
      .createSpy("getStars")
      .and.returnValue([true, false, false, false, false]),
  };
  mockUserDataService = {
    openPersonalPage: jasmine.createSpy("openPersonalPage"),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CurrentAlbumReviewsComponent, ReviewTileComponent],
      imports: [HttpClientTestingModule,MatDialogModule],
      providers: [
        { provide: StsConfigLoader, useValue: mockStsConfigLoader },
        { provide: AlbumDataService, useValue: mockAlbumDataService },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        {provide: MAT_DIALOG_DATA, useValue: {}},
        { provide: ReviewDataService, useValue: mockReviewDataService },
        { provide: UserDataService, useValue: mockUserDataService },
      ],
    });
    fixture = TestBed.createComponent(CurrentAlbumReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should catch user email on click", () => {
    const userEmail = "user@test.com";
    component.onUserClick(userEmail);
    expect(mockUserDataService.openPersonalPage).toHaveBeenCalledWith(
      userEmail
    );
  });

  it("should load and sort album reviews by createdAt correctly", () => {
    const earlierReview = {
      id: "mockId111",
      user: "mockUserId",
      userName: "Mock User",
      song: "mockSongId",
      songName: "Mock Song",
      image: "mock-image1.png",
      rating: 3,
      comment: "a new mock review",
      createdAt: new Date("2020-01-01"),
    };

    const laterReview = {
      id: "mockId222",
      user: "mockUserId",
      userName: "Mock User",
      song: "mockSongId",
      songName: "Mock Song",
      image: "mock-image2.png",
      rating: 2,
      comment: "a new mock review",
      createdAt: new Date("2022-01-01"),
    };

    mockReviewDataService.getAllReviewsForCurrentAlbum.and.returnValue(
      of([earlierReview, laterReview])
    );

    component.loadCurrentAlbumReviews();
    expect(
      mockReviewDataService.getAllReviewsForCurrentAlbum
    ).toHaveBeenCalledWith(mockAlbum.id);
  });

describe('CurrentAlbumReviewsComponent', () => {
  // ... Previous test code ...

  it('should unsubscribe when handleEditingChange is called with false', () => {
    const subscription = new Subscription();
    spyOn(subscription, 'unsubscribe');

    component.subscription = subscription; 

    component.handleEditingChange(false);

    expect(subscription.unsubscribe).toHaveBeenCalled();
  });

  it('should not unsubscribe when handleEditingChange is called with true', () => {
    const subscription = new Subscription();
    spyOn(subscription, 'unsubscribe');

    component.subscription = subscription; // Let's assign our mock subscription to the component

    component.handleEditingChange(true);

    expect(subscription.unsubscribe).not.toHaveBeenCalled();
  });

  // ... More test code ...
});

});
