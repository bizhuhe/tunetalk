import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { ReviewsPageComponent } from "./reviews-page.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
  StsConfigLoader,
  ConfigurationService,
} from "angular-auth-oidc-client";
import { Review } from "../review-data.service";
import { ReviewDataService } from "../review-data.service";
import { NavbarComponent } from "../navbar/navbar.component";
import { SearchComponent } from "../search/search.component";
import { Router } from "@angular/router";
import { of, Subject, Subscription, throwError } from "rxjs";
import { ThemeSwitcherComponent } from "../theme-switcher/theme-switcher.component";

describe("ReviewsPageComponent", () => {
  let component: ReviewsPageComponent;
  let fixture: ComponentFixture<ReviewsPageComponent>;
  let mockStsConfigLoader: any;
  let mockConfigurationService: any;
  let mockReviewDataService: any;
  let mockSubscription = new Subscription();
  let router: Router;
  let mockReviews = [
    {  
      id: "mockId111",
      user: "mockUserId",
      userName: "Mock User",
      song: "mockSongId",
      songName: "Mock Song",
      image: "mock-image.png",
      rating: 3,
      comment: "a new mock review",
      createdAt: new Date(), 
    },
  ];

  beforeEach(() => {
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
        .and.returnValue(
          of({
            configId: 'mockConfigId'
          })
        ),
    };

    
    mockReviewDataService = {
      get reviews() {
        return mockReviews;
      },
      set reviews(value) {
        mockReviews = value;
      },
      reviewUpdated: new Subject(),
      getAllReviews: jasmine.createSpy('getAllReviews').and.returnValue(of([])),
      subscribeToReviewUpdates: jasmine.createSpy('subscribeToReviewUpdates').and.callFake(() => {
        mockSubscription = mockReviewDataService.reviewUpdated.subscribe();
      }),
      
    };
    spyOn(mockReviewDataService.reviewUpdated, 'subscribe').and.returnValue(mockSubscription);
    TestBed.configureTestingModule({
      declarations: [ReviewsPageComponent, NavbarComponent, SearchComponent, ThemeSwitcherComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [
        { provide: StsConfigLoader, useValue: mockStsConfigLoader },
        { provide: ConfigurationService, useValue: mockConfigurationService },
        { provide: ReviewDataService, useValue: mockReviewDataService },
      ],
    });
    fixture = TestBed.createComponent(ReviewsPageComponent);

    component = fixture.componentInstance;
    component.subscription = mockSubscription;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
   
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("handleEditingChange", () => {
    beforeEach(() => {
      component.ngOnInit(); // make sure that component.subscription is defined
    });
  
    it("should unsubscribe when editing is false", () => {
      const unsubscribeSpy = spyOn(mockSubscription, "unsubscribe");
      component.handleEditingChange(false);
      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  
    it("should not unsubscribe when editing is true", () => {
      const unsubscribeSpy = spyOn(mockSubscription, "unsubscribe");
      component.handleEditingChange(true);
      expect(unsubscribeSpy).not.toHaveBeenCalled();
    });
  });
  
  it ('should navigate to the album detail page', ()=>{
    const albumId = 'albumId123';
    component.openAlbumTile(albumId);
    expect(router.navigate).toHaveBeenCalledWith(['/album-details', albumId]);
  })
  it('should subscribe to review updates', () => {
    component.ngOnInit();
    expect(mockReviewDataService.getAllReviews).toHaveBeenCalled();
    expect(mockReviewDataService.reviewUpdated.subscribe).toHaveBeenCalled();
  });

  
  describe("loadReviews", () => {
    it("should load reviews and sort them in descending order of creation date", () => {
      // Define two mock reviews with different createdAt dates.
      const earlyReview: Review = {
        _id: "mockId111",
        user: "mockUserId",
        userName: "Mock User",
        song: "mockSongId",
        songName: "Mock Song",
        image: "mock-image1.png",
        rating: 3,
        comment: "a new mock review",
        likes: 2,
        likedByUsers:[],
        replies: [],
        createdAt: new Date('2020-01-01'),
      
      };
      const laterReview: Review = {
        _id: "mockId222",
        user: "mockUserId",
        userName: "Mock User",
        song: "mockSongId",
        songName: "Mock Song",
        image: "mock-image2.png",
        rating: 2,
        comment: "a new mock review",
        likes: 4,
        likedByUsers:[],
        replies: [],
        createdAt: new Date('2022-01-01'),
     
      };

      mockReviewDataService.getAllReviews.and.returnValue(of([earlyReview, laterReview]));
  
      component.loadReviews();
      // The late review should now come first.
      expect(mockReviewDataService.reviews[0]).toEqual(laterReview);
      expect(mockReviewDataService.reviews[1]).toEqual(earlyReview);
    });
  
    it("should handle an error when loading reviews", () => {
      const mockError = 'An error occurred';
      mockReviewDataService.getAllReviews.and.returnValue(throwError(mockError));
      spyOn(console, 'log');
      component.loadReviews();
      expect(console.log).toHaveBeenCalledWith('Error occurred while retrieving reviews:', mockError);
    });
  });
  describe("loadReviews with search term", () => {
    let userReview, userNameReview, songNameReview, commentReview, nonMatchingReview;
  
    beforeEach(() => {
      // Define mock reviews that will match the search term
      userReview = {
        _id: "mockId1",
        user: "matchedTerm",
        userName: "Mock User",
        song: "mockSongId",
        songName: "Mock Song",
        image: "mock-image1.png",
        rating: 3,
        comment: "a new mock review",
        createdAt: new Date('2022-01-01'),
      };
  
      userNameReview = {
        _id: "mockId2",
        user: "mockUserId",
        userName: "matchedTerm",
        song: "mockSongId",
        songName: "Mock Song",
        image: "mock-image2.png",
        rating: 2,
        comment: "a new mock review",
        createdAt: new Date('2022-01-01'),
      };
  
      songNameReview = {
        _id: "mockId3",
        user: "mockUserId",
        userName: "Mock User",
        song: "mockSongId",
        songName: "matchedTerm",
        image: "mock-image3.png",
        rating: 4,
        comment: "a new mock review",
        createdAt: new Date('2022-01-01'),
      };
      commentReview = {
        _id: "mockId4",
        user: "mockUserId",
        userName: "Mock User",
        song: "mockSongId",
        songName: "Mock Song",
        image: "mock-image4.png",
        rating: 5,
        comment: "matchedTerm",
        createdAt: new Date('2022-01-01'),
      };
      nonMatchingReview = {
        _id: "mockId5",
        user: "mockUserId",
        userName: "Mock User",
        song: "mockSongId",
        songName: "Mock Song",
        image: "mock-image5.png",
        rating: 1,
        comment: "non-matching term",
        createdAt: new Date('2022-01-01'),
      };
  

      component.searchTerm = 'matchedTerm';
      mockReviewDataService.getAllReviews.and.returnValue(of([
        userReview,
        userNameReview,
        songNameReview,
        commentReview,
        nonMatchingReview,
      ]));
    });
    it("should include reviews when 'comment' matches the search term", () => {
      component.loadReviews();
      expect(mockReviewDataService.reviews).toContain(commentReview);
    });
  
    it("should exclude reviews when no properties match the search term", () => {
      component.loadReviews();
      expect(mockReviewDataService.reviews).not.toContain(nonMatchingReview);
    });
  
    it("should include reviews when 'user' matches the search term", () => {
      component.loadReviews();
      expect(mockReviewDataService.reviews).toContain(userReview);
    });
  
    it("should include reviews when 'userName' matches the search term", () => {
      component.loadReviews();
      expect(mockReviewDataService.reviews).toContain(userNameReview);
    });
  
    it("should include reviews when 'songName' matches the search term", () => {
      component.loadReviews();
      expect(mockReviewDataService.reviews).toContain(songNameReview);
    });
  
  });
  
  describe("previousPage", () => {
    it("should decrement pageNumber if greater than 1", () => {
      component.pageNumber = 2;
      component.previousPage();
      expect(component.pageNumber).toEqual(1);
    });
  
    it("should not decrement pageNumber if equal to 1", () => {
      component.pageNumber = 1;
      component.previousPage();
      expect(component.pageNumber).toEqual(1);
    });
    
  });
  
  describe("nextPage", () => {
    beforeEach(() => {
      component.pageSize = 5;  
      mockReviewDataService.reviews = Array(11).fill(mockReviews[0]);
    });
  
    it("should increment pageNumber if less than total pages", () => {
      component.pageNumber = 1;
      component.nextPage();
      expect(component.pageNumber).toEqual(2);
    });
  
    it("should not increment pageNumber if equal to total pages", () => {
      component.pageNumber = 3;  // total pages are 3
      component.nextPage();
      expect(component.pageNumber).toEqual(3);
    });
  });
  
});
