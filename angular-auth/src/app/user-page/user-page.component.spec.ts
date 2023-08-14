
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UserPageComponent } from "./user-page.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
  StsConfigLoader,
  ConfigurationService,
} from "angular-auth-oidc-client";
import { NavbarComponent } from "../navbar/navbar.component";
import { AuthorizeService } from "../auth.service";
import { User, UserDataService } from "../user-data.service";
import { ReviewDataService } from "../review-data.service";
import { Router, NavigationStart } from '@angular/router';
import { of, Subject,BehaviorSubject } from "rxjs";
import { Review } from "../review-data.service";
import { ReviewTileComponent } from "../review-tile/review-tile.component";
import { MatDialogModule } from "@angular/material/dialog";
import { ThemeSwitcherComponent } from "../theme-switcher/theme-switcher.component";
describe("UserPageComponent", () => {
  let component: UserPageComponent;
  let fixture: ComponentFixture<UserPageComponent>;
  let mockAuthorizeService: any;
  let mockReviewDataService: any;
  let mockUserDataService: any;
  let mockRouter: any;
  let mockStsConfigLoader: any;
  let mockConfigurationService: any;
  let originalState = history.state;
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
  mockAuthorizeService = {
    isAuthenticated: true,
    email: 'test@example.com',
    authStatus: new BehaviorSubject<boolean>(true),
    email$: new BehaviorSubject<string>('test@example.com'),
    checkAuth: () => of({
      isAuthenticated: true,
      userData: { /* the user data object you expect */ }
    })
  };
  
  
  mockUserDataService = {
    getCurrentUser: jasmine.createSpy("getCurrentUser").and.returnValue(
      Promise.resolve({
        _id: "mockId",
        email: "test@example.com",
        name: "test name",
        bio: "test bio",
        createdAt: new Date(),
        avatar: "test avatar",
        reviews: [],
      })
    ),
  };
  mockReviewDataService = {
    reviewUpdated: of({}),
    reviews: [mockReview],
    getAllReviewsForCurrentUser: jasmine
      .createSpy("getAllReviewsForCurrentUser")
      .and.returnValue(of({})),
    loadReviews: jasmine.createSpy("loadReviews"),
    getStars: jasmine.createSpy("getStars"),
    subscribeToReviewUpdates: jasmine.createSpy('subscribeToReviewUpdates'),

  };

  
  beforeEach(async () => {
    history.replaceState({ user: null }, "");
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

    mockRouter = {
      events: of(new NavigationStart(0, 'http://localhost/'))
    };

    await TestBed.configureTestingModule({
      declarations: [UserPageComponent, NavbarComponent, ReviewTileComponent,ThemeSwitcherComponent],
      imports: [HttpClientTestingModule,MatDialogModule],
      providers: [
        { provide: StsConfigLoader, useValue: mockStsConfigLoader },
        { provide: ConfigurationService, useValue: mockConfigurationService },
        { provide: AuthorizeService, useValue: mockAuthorizeService },
        { provide: UserDataService, useValue: mockUserDataService },
        { provide: ReviewDataService, useValue: mockReviewDataService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterAll(() => {
    history.replaceState(originalState, "");
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
  
  it("should load user from history state if it exists", () => {
    history.replaceState(
      {
        user: {
          _id: "mockId",
          email: "test@example.com",
          name: "test name",
          bio: "test bio",
          createdAt: new Date(),
          avatar: "test avatar",
          reviews: [],
        },
      },
      ""
    );

    fixture = TestBed.createComponent(UserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.user).toBeDefined();
    expect(component.user._id).toEqual("mockId");
  });

  it("should load user from server if not in history state and user is authenticated", async () => {
    // Make sure history.state.user is null
    history.replaceState({ user: null }, "");

    fixture.detectChanges();

    await fixture.whenStable();

    expect(component.user).toBeDefined();
    expect(component.user._id).toEqual("mockId");
    expect(mockUserDataService.getCurrentUser).toHaveBeenCalledWith(
      "test@example.com"
    );
  });
  // it("should load reviews successfully", () => {
  //   const mockReviews: Review[] = [
  //     {
  //       _id: "mockId2",
  //       user: "mockUserId2",
  //       userName: "Mock User2",
  //       song: "mockSongId",
  //       songName: "Mock Song",
  //       image: "mock-image.png",
  //       rating: 4,
  //       comment: "review from user2",
  //       likes: 2,
  //       likedByUsers: [],
  //       replies: [],
  //       createdAt: new Date(),
  //     },
  //     {
  //       _id: "mockId1",
  //       user: "mockUserId1",
  //       userName: "Mock User1",
  //       song: "mockSongId",
  //       songName: "Mock Song",
  //       image: "mock-image.png",
  //       rating: 3,
  //       comment: "review from user1",
  //       likes: 1,
  //       likedByUsers: [],
  //       replies: [],
  //       createdAt: new Date(),
  //     },
  //   ];

  //   mockReviewDataService.getAllReviewsForCurrentUser.and.returnValue(
  //     of(mockReviews)
  //   );
  //   component.loadReviews();

  //   // Check if the reviews are properly processed and sorted
  //   expect(mockReviewDataService.reviews).toEqual(
  //     mockReviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  //   );
  // });

  // it("should log an error for unexpected response", () => {
  //   const unexpectedResponse = "Unexpected response";
  //   mockReviewDataService.loadReviews.and.throwError(unexpectedResponse);
  
  //   const consoleLogSpy = spyOn(console, "error");
  //   component.loadReviews();
  //   expect(consoleLogSpy).toHaveBeenCalledWith(
  //     "Unexpected response: ",
  //     unexpectedResponse
  //   );
  // });
  

  it("should call loadreviews while handling review deleted", () => {
    spyOn(component, "loadReviews");

    component.handleReviewDeleted();
    expect(component.loadReviews).toHaveBeenCalled();
  });
});
