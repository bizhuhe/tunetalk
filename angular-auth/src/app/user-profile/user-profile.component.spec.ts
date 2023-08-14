import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EventEmitter } from "@angular/core";
import { FormsModule, NgForm, FormGroup } from "@angular/forms";
import { UserProfileComponent } from "./user-profile.component";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import {
  StsConfigLoader,
  ConfigurationService,
} from "angular-auth-oidc-client";
import { NavbarComponent } from "../navbar/navbar.component";
import { of, throwError, BehaviorSubject } from "rxjs";
import { User, UserDataService } from "../user-data.service";
import { Review, ReviewDataService } from "../review-data.service";
import { AuthorizeService } from "../auth.service";
import { fakeAsync, tick } from "@angular/core/testing";
import { ReviewTileComponent } from "../review-tile/review-tile.component";
import { MatDialogModule } from "@angular/material/dialog";
import { ThemeSwitcherComponent } from "../theme-switcher/theme-switcher.component";

describe("UserProfileComponent", () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let mockStsConfigLoader: any;
  let mockConfigurationService: any;

  let mockAuthorizeService: any;
  let mockUserDataService: any;
  let mockReviewDataService: any;
  let httpTestingController: HttpTestingController;
  const mockFile = new File(["file content"], "avatar.png", {
    type: "image/png",
  });
  // const mockAuthorizeService = {
  //   isAuthenticated: true,
  //   email: "test@example.com",
  // };
  const mockUser = {
    _id: "12345",
    email: "mockemail",
    name: "mock name",
    bio: "mock bio",
    createdAt: new Date(),
    avatar: "mock image",
    reviews: [],
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
  const mockReview: Review = {
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
  beforeEach(() => {
    mockAuthorizeService = {
      isAuthenticated: true,
      email: "test@example.com",
      authStatus: new BehaviorSubject<boolean>(true),
      email$: new BehaviorSubject<string>("test@example.com"),
      checkAuth: () =>
        of({
          isAuthenticated: true,
          userData: {
            /* the user data object you expect */
          },
        }),
    };

    mockUserDataService = {
      getCurrentUser: jasmine
        .createSpy("getCurrentUser")
        .and.returnValue(Promise.resolve(mockUser)),
      emitReviewUpdated: jasmine.createSpy("emitReviewUpdated"),
    };
    mockReviewDataService = {
      reviewUpdated: of({}),
      reviews: [mockReview],
      getStars: jasmine.createSpy("getStars"),
      subscribeToReviewUpdates: jasmine.createSpy("subscribeToReviewUpdates"),
      loadReviews: jasmine.createSpy("loadReviews"),
      getAllReviewsForCurrentUser: jasmine
        .createSpy("getAllReviewsForCurrentUser")
        .and.returnValue(of([mockReview])),
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

    mockConfigurationService = {
      getOpenIDConfigurations: jasmine
        .createSpy("getOpenIDConfigurations")
        .and.returnValue(of({})),
    };

    TestBed.configureTestingModule({
      declarations: [
        UserProfileComponent,
        NavbarComponent,
        ReviewTileComponent,
        ThemeSwitcherComponent
      ],
      imports: [HttpClientTestingModule, FormsModule, MatDialogModule],
      providers: [


        { provide: StsConfigLoader, useValue: mockStsConfigLoader },
        { provide: ConfigurationService, useValue: mockConfigurationService },
        { provide: AuthorizeService, useValue: mockAuthorizeService },
        { provide: UserDataService, useValue: mockUserDataService },
        { provide: ReviewDataService, useValue: mockReviewDataService },
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    component.selectedFile = mockFile;
    component.user = { ...mockUser };

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load user data and reviews when authenticated", async () => {
    spyOn(component, "loadReviews").and.callThrough();

    await component.ngOnInit();

    expect(component.email).toBe(mockAuthorizeService.email);
    expect(mockUserDataService.getCurrentUser).toHaveBeenCalledWith(
      component.email
    );
    expect(component.user).toEqual(mockUser);
    expect(component.initialBio).toBe(mockUser.bio);
    expect(component.loadReviews).toHaveBeenCalled();
  });

  it("should update the user bio and reset the form", fakeAsync(() => {
    const ngFormMock: Partial<NgForm> = {
      value: { bio: "Updated bio" },
      valid: true,
      resetForm: jasmine.createSpy("resetForm"),
    };

    const updatedUser: User = {
      _id: "12345",
      email: "mockemail",
      name: "mock name",
      bio: "Updated bio",
      createdAt: new Date(),
      avatar: "mock image",
      reviews: [],
    };

    spyOn(component, "updateUser");
    const putObservable = of("success");
    spyOn(component.http, "put").and.returnValue(putObservable);

    // Modify the getCurrentUser function to return the updatedUser directly
    mockUserDataService.getCurrentUser = jasmine
      .createSpy("getCurrentUser")
      .and.returnValue(Promise.resolve(updatedUser));
    component.updateBio(ngFormMock as NgForm);
    component.updateUser(updatedUser);

    tick();
    expect(ngFormMock.resetForm).toHaveBeenCalled();
    expect(component.editingBio).toBe(false);
    expect(component.updateUser).toHaveBeenCalledWith(updatedUser);
  }));

  it("should update the avatar", () => {
    const ngFormMock = <NgForm>{
      valid: true,
    };
    spyOn(component, "updateUser");

    component.updateAvatar(ngFormMock);

    expect(ngFormMock.valid).toBe(true);
    expect(component.selectedFile).toBe(mockFile);
    expect(component.updateUser).toHaveBeenCalledWith({
      avatar: mockFile,
      bio: component.user.bio,
    });
    expect(component.editingAvatar).toBe(false);
  });
  it("should assign the selected file", () => {
    const mockEvent = {
      target: {
        files: [mockFile],
      },
    };
    component.onFileSelect(mockEvent);
    expect(component.selectedFile).toEqual(mockFile);
    expect(component.selectedFileName).toEqual(mockFile.name);
  });

  it("should edit the review", () => {
    component.editReview(mockUser);
    expect(component.user).toEqual(mockUser);
    expect(component.userBeingEdited).toEqual(mockUser);

    expect(component.editingBio).toBe(true);
  });
  it("should reset the form properties", () => {
    component.user = mockUser;
    component.editingBio = true;
    component.userBeingEdited = mockUser;

    component.resetForm(<NgForm>{});
    // Expect the properties to be reset to their initial values
    expect(component.user).toEqual({});
    expect(component.editingBio).toBe(false);
    expect(component.userBeingEdited).toBeUndefined();
  });
  it("should toggle the editingAvatar property", () => {
    component.editingAvatar = false;
    component.openAvatarInput();
    expect(component.editingAvatar).toBe(true);
    component.openAvatarInput();
    expect(component.editingAvatar).toBe(false);
  });
  it("should toggle the editingBio property", () => {
    component.editingBio = false;
    component.openBioInput();
    expect(component.editingBio).toBe(true);
    component.openBioInput();
    expect(component.editingBio).toBe(false);
  });
  

  it("should call the loadReviews method", () => {
    spyOn(component, "loadReviews");
    component.handleReviewDeleted();
    expect(component.loadReviews).toHaveBeenCalled();
  });
  it("should unsubscribe when editing is falsy", () => {
    const mockSubscription = jasmine.createSpyObj("Subscription", [
      "unsubscribe",
    ]);
    component.subscription = mockSubscription;
    mockSubscription.unsubscribe.and.stub();

    component.handleEditingChange(false);
    expect(mockSubscription.unsubscribe).toHaveBeenCalled();
  });

  it("should update user", () => {
    const userInformation = { bio: "New bio" };
    const updatedUser = {
      ...component.user,
      ...userInformation,
    };

    // Exclude _id and createdAt for expectedUpdatedUser
    const expectedUpdatedUser = {
      email: component.user.email,
      name: component.user.name,
      avatar: component.user.avatar,
      reviews: component.user.reviews,
      ...userInformation,
    };

    mockUserDataService.getCurrentUser.and.returnValue(
      Promise.resolve(updatedUser)
    );
    mockUserDataService.emitReviewUpdated.and.callThrough();

    component.updateUser(userInformation);

    const req = httpTestingController.expectOne(
      `http://localhost:3000/user/id/${component.user._id}`
    );
    expect(req.request.method).toEqual("PUT");
    expect(req.request.body).toEqual(expectedUpdatedUser);

    req.flush("Update successful");
    // Use setTimeout to wait for asynchronous operations
    setTimeout(() => {
      expect(component.user).toEqual(updatedUser);
      expect(mockUserDataService.emitReviewUpdated).toHaveBeenCalledWith(
        expectedUpdatedUser
      );
    }, 0);
  });

  it("should load and sort album reviews by createdAt correctly", () => {
    const earlierReview = {
      _id: "mockId111",
      user: "mockUserId",
      userName: "Mock User",
      song: "mockSongId",
      songName: "Mock Song",
      image: "mock-image1.png",
      rating: 3,
      comment: "a new mock review",
      likes: 2,
      likedByUsers: [],
      replies: [],
      createdAt: new Date("2020-01-01"),
    };

    const laterReview = {
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
      createdAt: new Date("2022-01-01"),
    };
    const mockReviews = [earlierReview, laterReview];
    mockReviewDataService.loadReviews = jasmine
      .createSpy("loadReviews")
      .and.callFake((userId) => {
        // expect the loadReviews to sort the reviews
        return of(
          mockReviews.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
          )
        );
      });
    component.user = { _id: "mockUserId" };

    component.loadReviews();
    expect(mockReviewDataService.loadReviews).toHaveBeenCalledWith(
      "mockUserId"
    );
    const sortedReviews = mockReviewDataService.loadReviews(component.user._id);
    sortedReviews.subscribe((reviews) => {
      expect(reviews[0]).toEqual(laterReview);
      expect(reviews[1]).toEqual(earlierReview);
    });
  });

  it("should subscribe to review updates and update review data accordingly", () => {
    const updatedReview: Review = {
      ...mockReview,
      comment: "an updated mock review",
    };

    // Manually update the review in the service's reviews array
    mockReviewDataService.reviews = [updatedReview];

    mockReviewDataService.reviewUpdated = new EventEmitter<Review>();

    mockReviewDataService.reviewUpdated.emit(updatedReview);

    // Expect the review data to have been updated
    expect(mockReviewDataService.reviews[0]).toEqual(updatedReview);
  });

  it("should not update reviews data if the review id is not found", () => {
    const updatedReview: Review = {
      ...mockReview,
      _id: "differentId", // this review won't be found in the reviews array
      comment: "an updated mock review",
    };

    mockReviewDataService.reviews = [mockReview];
    mockReviewDataService.reviewUpdated = new EventEmitter<Review>();

    mockReviewDataService.reviewUpdated.emit(updatedReview);

    // Expect the review data to have not been updated
    expect(mockReviewDataService.reviews[0]).toEqual(mockReview);
  });
});
