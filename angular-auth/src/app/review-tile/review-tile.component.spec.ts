import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { ReviewTileComponent } from "./review-tile.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
  StsConfigLoader,
  ConfigurationService,
} from "angular-auth-oidc-client";
import {
  MatDialogModule,
  MatDialogRef,
  MatDialog,
} from "@angular/material/dialog";
import { NavigationStart, Router } from "@angular/router";
import { EditReviewModule } from "../edit-review/edit-review.module";
import { UserDataService } from "../user-data.service";
import { of, Subject, throwError } from "rxjs";
import { Component, SimpleChanges } from "@angular/core";
import { ReviewDataService } from "../review-data.service";
import { Review } from "../review-data.service";
import { AuthorizeService } from "../auth.service";
import { LoginDialogComponent } from "../login-dialog/login-dialog.component";

// Mock Component
@Component({
  selector: "app-confirm-dialog",
  template: "",
})
class MockConfirmDialogComponent {}

describe("ReviewTileComponent", () => {
  let component: ReviewTileComponent;
  let fixture: ComponentFixture<ReviewTileComponent>;
  let mockStsConfigLoader: any;
  let mockConfigurationService: any;
  let mockAuthorizeService: any;
  let userService: any;
  let mockRouter: { events: Subject<any> };
  let mockRouterSubject: Subject<any>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<any>>;
  let mockReviewDataService: any;
  let mockStorage: Record<string, any> = { editing: false };
  let consoleLogSpy: jasmine.Spy;
  let consoleErrorSpy: jasmine.Spy;
  const mockEditedReview = {
    _id: "mockId2",
    user: "mockUserId2",
    userName: "Mock User2",
    song: "mockSongId",
    songName: "Mock Song",
    image: "mock-image.png",
    rating: 4,
    comment: "review from user2",
    likes: 2,
    likedByUsers: [],
    replies: [],
    createdAt: new Date(),
  };
  const mockAlbum = {
    id: "2",
    name: "Album Name",
    artists: ["some singer"],
    image: "Album Image",
    popularity: 46,
    release: new Date(),
    reviews: [],
  };
  const mockReview = {
    _id: "mockId2",
    user: "mockUserId2",
    userName: "Mock User2",
    song: "mockSongId",
    songName: "Mock Song",
    image: "mock-image.png",
    rating: 4,
    comment: "review from user2",
    likes: 2,
    likedByUsers: [],
    replies: [],
    createdAt: new Date(),
  };

  const dialogRefSpyObj = jasmine.createSpyObj({
    afterClosed: of("test@example.com"), // Simulate user selecting an email
    close: null,
  });
  beforeEach(() => {
    mockAuthorizeService = jasmine.createSpyObj("AuthorizeService", [
      "isAuthenticated",
    ]);
    mockDialog = jasmine.createSpyObj("MatDialog", ["open"]);
    mockDialogRef = jasmine.createSpyObj("MatDialogRef", ["afterClosed"]);
    mockStsConfigLoader = {
      loadConfigs: jasmine.createSpy("loadConfigs").and.returnValue(
        of({
          clientId: "mockClientId",
          server: "mockServer",
          redirectUrl: "mockRedirectUrl",
        })
      ),
    };

    mockConfigurationService = {
      getOpenIDConfigurations: jasmine
        .createSpy("getOpenIDConfigurations")
        .and.returnValue(of({ configId: "0-client-bizhu" })),
    };

    mockReviewDataService = jasmine.createSpyObj("reviewDataService", [
      "shareReview",
      "deleteReview",
      "getStars",
    ]);
    mockRouterSubject = new Subject();

    mockRouter = {
      events: mockRouterSubject,
    };
    consoleLogSpy = spyOn(console, "log");
    consoleErrorSpy = spyOn(console, "error");

    spyOn(localStorage, "removeItem").and.callFake((key) => {
      delete mockStorage[key];
      spyOn(localStorage, "setItem").and.callFake((key, value) => {
        mockStorage["editing"] = true;
      });
    });

    TestBed.configureTestingModule({
      declarations: [
        ReviewTileComponent,
        MockConfirmDialogComponent,
        LoginDialogComponent,
      ],
      imports: [HttpClientTestingModule, MatDialogModule, EditReviewModule],
      providers: [
        { provide: StsConfigLoader, useValue: mockStsConfigLoader },
        { provide: ConfigurationService, useValue: mockConfigurationService },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: Router, useValue: mockRouter },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: ReviewDataService, useValue: mockReviewDataService },
      ],
    });

    fixture = TestBed.createComponent(ReviewTileComponent);
    userService = TestBed.inject(UserDataService);
    component = fixture.componentInstance;
    component.review = {
      _id: "mockId2",
      user: "mockUserId2",
      userName: "Mock User2",
      song: "mockSongId",
      songName: "Mock Song",
      image: "mock-image.png",
      rating: 4,
      comment: "review from user2",
      likes: 2,
      likedByUsers: [],
      replies: [],
      createdAt: new Date(),
    };
    component.editing = false;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should reset editing state and remove from local storage on NavigationStart", () => {
    component.editing = true;

    const mockNavigationStart = new NavigationStart(1, "test-url");
    mockRouter.events.next(mockNavigationStart); // Simulate NavigationStart event
    expect(component.editing).toBe(false); // Editing state should be reset to false
    expect(localStorage.removeItem).toHaveBeenCalledWith("editing");
  });

  it("should not reset editing state or remove from local storage for other events", () => {
    component.editing = true;
    const mockOtherEvent: any = new Event("other-event");
    mockRouter.events.next(mockOtherEvent); // Simulate the other event
    expect(component.editing).toBe(true); // Editing state should remain unchanged
    expect(localStorage.removeItem).not.toHaveBeenCalled();
  });

  it("should fetch user email and open user page", () => {
    const mockEmail = "test@email";
    spyOn(userService, "openPersonalPage").and.callThrough();
    component.onUserClick(mockEmail);
    expect(userService.openPersonalPage).toHaveBeenCalledWith(mockEmail);
  });

  it("should log message to console on successful email send", () => {
    // Set up the mock service method to return a successful Observable
    mockReviewDataService.shareReview.and.returnValue(of({}));
    component.sendReviewEmail({} as Review, "test@example.com");
    expect(consoleLogSpy).toHaveBeenCalledWith("Email sent successfully");
  });
  it("should log error to console on error occured while sending email", () => {
    mockReviewDataService.shareReview.and.returnValue(throwError("Test error"));

    component.sendReviewEmail({} as Review, "test@example.com");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error sending email:",
      "Test error"
    );
  });

  it("should change editing to false and remove localstorage", () => {
    component.hideReviewInput();
    expect(component.editing).toBe(false);
  });

  it("should set editing to true, emit the editing value and set it in localstorage", () => {
    const mockReviewId = "mockReviewId";
    const setItemSpy = spyOn(localStorage, "setItem");

    spyOn(component.editingChange, "emit");
    component.editReview(mockReviewId);

    expect(component.editing).toBe(true);
    expect(component.editingChange.emit).toHaveBeenCalledWith(true);
    expect(setItemSpy).toHaveBeenCalledWith("editing", "true");
  });

  it("should update the review property when changes occur", () => {
    const changes: SimpleChanges = {
      review: {
        currentValue: mockReview,
        firstChange: true,
        previousValue: undefined,
        isFirstChange: () => true,
      },
    };

    component.ngOnChanges(changes);
    expect(component.review).toEqual(mockReview);
  });

  it("should not update the review property if review changes are not present", () => {
    const mockReview = {
      _id: "mockId2",
      user: "mockUserId2",
      userName: "Mock User2",
      song: "mockSongId",
      songName: "Mock Song",
      image: "mock-image.png",
      rating: 4,
      comment: "review from user2",
      likes: 2,
      likedByUsers: [],
      replies: [],
      createdAt: new Date(),
    };
    const changes: SimpleChanges = {};

    component.review = mockReview;

    component.ngOnChanges(changes);
    expect(component.review).toEqual(mockReview);
  });

  it("should edit the review, change editing status and remove localstorage", () => {
    component.handleReviewEdited(mockEditedReview);
    expect(component.review).toEqual(mockEditedReview);
    expect(component.editing).toBe(false);
  });

  it("should share review and close the dialog", () => {
    const mockDialogRef = {
      close: jasmine.createSpy("close"),
      componentInstance: { emailSelected: new Subject<string>() },
    };

    const mockEmail = "test@test.com";
    const mockDialog = jasmine.createSpyObj("dialog", ["open"]);
    mockDialog.open.and.returnValue(mockDialogRef);

    mockReviewDataService.shareReview.and.returnValue(of());
    component.dialog = mockDialog;
    component.reviewDataService = mockReviewDataService;
    component.shareReview(mockReview);

    expect(mockDialog.open).toHaveBeenCalled();
    mockDialogRef.componentInstance.emailSelected.next(mockEmail);

    expect(mockReviewDataService.shareReview).toHaveBeenCalledWith(mockReview, {
      createdReview: mockReview,
      recipient: mockEmail,
      subject: "Review Sharing",
      text: "Please check out this review:",
    });

    expect(mockDialogRef.close).toHaveBeenCalled();
  });
  it("should initialize rating and comment when review is defined and has values", () => {
    component.review = {
      _id: "mockId2",
      user: "mockUserId2",
      userName: "Mock User2",
      song: "mockSongId",
      songName: "Mock Song",
      image: "mock-image.png",
      rating: 4,
      comment: "Test comment",
      likes: 2,
      likedByUsers: [],
      replies: [],
      createdAt: new Date(),
    };

    component.initializeReviewData();

    expect(component.initialRating).toBe(4);
    expect(component.initialComment).toBe("Test comment");
  });

  it("should check editing status from local storage and emit event if true", () => {
    const localStorageGetItemSpy = spyOn(
      localStorage,
      "getItem"
    ).and.returnValue("true");
    const eventEmitterSpy = spyOn(component.editingChange, "emit");

    component.checkEditingStatus();

    // Verify localStorage.getItem was called with correct key
    expect(localStorageGetItemSpy).toHaveBeenCalledWith("editing");

    expect(eventEmitterSpy).toHaveBeenCalledWith(true);
    expect(component.editing).toBe(true);
  });

  it("should delete review and close the dialog", () => {
    const mockReviewId = "mockReviewId";

    mockDialog.open.and.returnValue(dialogRefSpyObj);

    mockReviewDataService.deleteReview.and.returnValue(of(null));

    const reviewDeletedSpy = spyOn(component.reviewDeleted, "emit");
    component.deleteReview(mockReviewId);

    expect(mockDialog.open).toHaveBeenCalledWith(jasmine.any(Function), {
      width: "350px",
      data: "Are you sure you want to delete this review?",
    });

    dialogRefSpyObj.afterClosed().subscribe(() => {
      expect(mockReviewDataService.deleteReview).toHaveBeenCalledWith(
        mockReviewId
      );
      expect(reviewDeletedSpy).toHaveBeenCalled();
    });
  });
  it("should handle an error when loading reviews", () => {
    const mockReviewId = "mockReviewId";
    const mockError = "An error occurred";

    mockDialog.open.and.returnValue(dialogRefSpyObj);

    mockReviewDataService.deleteReview.and.returnValue(throwError(mockError));
    component.deleteReview(mockReviewId);
  });

  it("should fetch the current album and redirect", () => {
    let getAlbumByIdResult: Subject<any> = new Subject<any>();

    const mockAlbumDataService = jasmine.createSpyObj("albumDataService", [
      "getAlbumById",
      "setAlbum",
    ]);
    const mockRouter = jasmine.createSpyObj("router", ["navigate"]);
    mockAlbumDataService.getAlbumById.and.returnValue(
      getAlbumByIdResult.asObservable()
    );
    mockAlbumDataService.setAlbum.and.callThrough();
    component.albumDataService = mockAlbumDataService;
    component.router = mockRouter;
    component.onAlbumClick(mockReview.song);
    getAlbumByIdResult.next(mockAlbum);
    expect(mockAlbumDataService.setAlbum).toHaveBeenCalledWith(mockAlbum);

    getAlbumByIdResult.error("Mock error");
    expect(console.error).toHaveBeenCalledWith(
      "Error occurred while retrieving album:",
      "Mock error"
    );
  });

  it("should open login dialog if user is not authenticated", () => {
    // spyOn(userService, 'isAuthenticated').and.returnValue(false);

    const mockDialogRef = { close: jasmine.createSpy("close") };

    const mockDialog = jasmine.createSpyObj("dialog", ["open"]);
    mockDialog.open.and.returnValue(mockDialogRef);

    component.dialog = mockDialog;

    component.likeReview();

    expect(mockDialog.open).toHaveBeenCalled();
  });
  it("should open reply input if user is authenticated", () => {
    mockAuthorizeService.isAuthenticated.and.returnValue(true);

    component.clickReply();
    expect(component.showReplyInput).toBe(false);
  });

  it("should open login dialog if user is not authenticated", () => {
    const dialogData = {
      data: {
        dialogMessage:
          "Please login to see more replies, and you can create one your own",
      },
    };
    mockAuthorizeService.isAuthenticated.and.returnValue(false);

    component.clickReply();
    expect(mockDialog.open).toHaveBeenCalledWith(
      LoginDialogComponent,
      dialogData
    );
  });
  it('should handle total replies correctly', () => {
    component.handleTotalReplies(5);
    expect(component.totalReplies).toEqual(5);

    component.handleTotalReplies(10);
    expect(component.totalReplies).toEqual(10);
  });
});
