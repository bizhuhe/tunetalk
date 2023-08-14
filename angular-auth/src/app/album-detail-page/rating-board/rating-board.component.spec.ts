import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RatingBoardComponent } from './rating-board.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AlbumDataService } from '../../album-data.service';
import { ReviewDataService } from '../../review-data.service';
import { of } from 'rxjs';

describe('RatingBoardComponent', () => {
  let component: RatingBoardComponent;
  let fixture: ComponentFixture<RatingBoardComponent>;
  let mockAlbumDataService: jasmine.SpyObj<AlbumDataService>;
  let mockReviewDataService: jasmine.SpyObj<ReviewDataService>;

  const mockReview1 = {
    _id: "mockId111",
      user: "mockUserId",
      userName: "Mock User",
      song: "mockSongId",
      songName: "Mock Song",
      image: "mock-image1.png",
      rating: 1,
      comment: "a new mock review",
      createdAt: new Date("2020-01-01"),
      likes: 0,
      likedByUsers: [],
      replies: []
  }

  const mockReview2 = {
    _id: "mockId222",
      user: "mockUserId",
      userName: "Mock User",
      song: "mockSongId",
      songName: "Mock Song",
      image: "mock-image1.png",
      rating: 2,
      comment: "a new mock review",
      createdAt: new Date("2020-01-01"),
      likes: 0,
      likedByUsers: [],
      replies: []
  }
  const mockReview3 = {
    _id: "mockId333",
      user: "mockUserId",
      userName: "Mock User",
      song: "mockSongId",
      songName: "Mock Song",
      image: "mock-image1.png",
      rating: 3,
      comment: "a new mock review",
      createdAt: new Date("2020-01-01"),
      likes: 0,
      likedByUsers: [],
      replies: []
  }
  const mockReview4 = {
    _id: "mockId444",
      user: "mockUserId",
      userName: "Mock User",
      song: "mockSongId",
      songName: "Mock Song",
      image: "mock-image1.png",
      rating: 4,
      comment: "a new mock review",
      createdAt: new Date("2020-01-01"),
      likes: 0,
      likedByUsers: [],
      replies: []
  }
  const mockReview5= {
    _id: "mockId555",
      user: "mockUserId",
      userName: "Mock User",
      song: "mockSongId",
      songName: "Mock Song",
      image: "mock-image1.png",
      rating: 5,
      comment: "a new mock review",
      createdAt: new Date("2020-01-01"),
      likes: 0,
      likedByUsers: [],
      replies: []
  }

  const mockAlbum = {
    id: "album123",
    name: "Album Name",
    artists: ["some singer"],
    image: "Album Image",
    popularity: 59,
    release: new Date(),
    reviews: ["mockId111", "mockId222", "mockId333", "mockId444", "mockId555"],
  };
  beforeEach(() => {
    mockAlbumDataService = jasmine.createSpyObj('AlbumDataService', ['getAlbum']);
    mockReviewDataService = jasmine.createSpyObj('ReviewDataService', ['getAllReviewsForCurrentAlbum']);

    TestBed.configureTestingModule({
      declarations: [RatingBoardComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AlbumDataService, useValue: mockAlbumDataService },
        { provide: ReviewDataService, useValue: mockReviewDataService }
      ]
    });

    fixture = TestBed.createComponent(RatingBoardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load album ratings and calculate average', () => {
    const mockReviews = [
      mockReview1, mockReview2, mockReview3, mockReview4, mockReview5
    ];

    mockAlbumDataService.getAlbum.and.returnValue({ id: 'album123' });
    mockReviewDataService.getAllReviewsForCurrentAlbum.and.returnValue(of(mockReviews));

    component.ngOnInit();

    expect(mockAlbumDataService.getAlbum).toHaveBeenCalled();
    expect(mockReviewDataService.getAllReviewsForCurrentAlbum).toHaveBeenCalledWith('album123');
    expect(component.ratings).toEqual([1, 2, 3, 4, 5]);
    expect(component.averageRating).toEqual('6.0');
    expect(component.percentageOneStar).toEqual('20.0%');
    expect(component.percentageTwoStars).toEqual('20.0%');
    expect(component.percentageThreeStars).toEqual('20.0%');
    expect(component.percentageFourStars).toEqual('20.0%');
    expect(component.percentageFiveStars).toEqual('20.0%');
  });

  // Add more test cases for other methods and behaviors of the component
});
