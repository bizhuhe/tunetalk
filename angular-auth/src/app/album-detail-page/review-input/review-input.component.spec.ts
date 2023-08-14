import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { ReviewInputComponent } from "./review-input.component";
import { StsConfigLoader } from "angular-auth-oidc-client";
import { AlbumDataService } from "src/app/album-data.service";
import {
  HttpTestingController,
  HttpClientTestingModule,
} from "@angular/common/http/testing";
import { of } from "rxjs";
import { NgForm } from "@angular/forms";
import { Review } from "src/app/review-data.service";
import { InputService } from "src/app/input.service";
import { Reply } from '../../review-tile/reply-input/reply-input.component';
describe("ReviewInputComponent", () => {
  let component: ReviewInputComponent;
  let fixture: ComponentFixture<ReviewInputComponent>;
  let httpTestingController: HttpTestingController;

  let mockAlbumDataService: any;
  let mockStsConfigLoader: any;
  let mockInputService: any;
  const mockReview = {
    _id: "mockId111",
    user: "mockUserId",
    userName: "Mock User",
    song: "mockSongId",
    songName: "Mock Song",
    image: "mock-image1.png",
    rating: 3,
    comment: "a new mock review",
    likes: 1,
    likedByUsers: [],
    replies: [],
    createdAt: new Date("2020-01-01"),
  };
  beforeEach(async () => {
    mockStsConfigLoader = {
      loadConfig: jasmine.createSpy("loadConfig").and.returnValue(
        of({
          clientId: "mockClientId",
          server: "mockServer",
          redirectUrl: "mockRedirectUrl",
        })
      ),
      loadConfigs: jasmine.createSpy("loadConfigs").and.returnValue(of({})),
    };

    // Create a mock album
    const mockAlbum = {
      id: "1",
      name: "Album Name",
      artists: ["some singer"],
      image: "Album Image",
      popularity: 29,
      release: new Date(),
      reviews: [],
    };

    mockAlbumDataService = {
      getAlbum: jasmine.createSpy("getAlbum").and.returnValue(mockAlbum),
    };
    mockInputService = {
      editInput: jasmine.createSpy("editInput").and.callFake((component: any, currentInput: any) => {
        component.review = { ...currentInput };
        component.reviewBeingEdited = currentInput;
        component.editing = true;
      }),
      resetForm: jasmine.createSpy("resetForm").and.callFake((component: any, form: NgForm) => {
        component.review = {};
        component.editing = false;
        component.reviewBeingEdited = undefined;
      }),
    };
    
    
    await TestBed.configureTestingModule({
      declarations: [ReviewInputComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [
        { provide: StsConfigLoader, useValue: mockStsConfigLoader },
        { provide: AlbumDataService, useValue: mockAlbumDataService },
        { provide: InputService, useValue: mockInputService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewInputComponent);
    component = fixture.componentInstance;
    component.review = mockReview;
    component.inputService = mockInputService;
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });
  afterEach(() => {
    httpTestingController.verify();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should set editing to true when newReviewClick is called", () => {
    expect(component.editing).toBeFalse();
    component.newReviewClick();
    expect(component.editing).toBeTrue();
  });
  it("should set editing to true and update the review when editReview is called", () => {
    expect(component.editing).toBeFalse();
    component.editReview(mockReview);

    expect(component.editing).toBeTrue();
    expect(component.review).toEqual(mockReview);
    expect(component.reviewBeingEdited).toEqual(mockReview);
  });
  it ("should reset the form", ()=>{
    component.editing = true;
    const mockForm = {
      valid: true,
    } as NgForm;

    component.resetForm(mockForm);
    expect(component.editing).toBeFalse();
    expect(component.review).toEqual({});
    expect(component.reviewBeingEdited).toBeUndefined();
})

  it("should submit the form and emit reviewSubmitted event when submitForm is called with a valid form", () => {
    const mockForm = {
      valid: true,
    } as NgForm;

    const mockReview: Review = {
      _id: "mockId111",
      user: "mockUserId",
      userName: "Mock User",
      song: "mockSongId",
      songName: "Mock Song",
      image: "mock-image1.png",
      rating: 3,
      comment: "a new mock review",
      likes: 1,
      likedByUsers: [],
      replies: [],
      createdAt: new Date("2020-01-01"),
    };

    component.review = mockReview;
    spyOn(component.reviewSubmitted, "emit");
    spyOn(component, "resetForm").and.callFake(() => component.review = {});
    spyOn(component, "createReview");

    // Call the submitForm method
    component.submitForm(mockForm);
    expect(component.reviewSubmitted.emit).toHaveBeenCalled();
    expect(component.editing).toBeFalse();
    expect(component.review).toEqual({});
  });

  it("should make a POST request to create music", () => {
    const musicInformation = {
      // Mock your music information object here
      id: "132",
      musicName: "mock music",
      artists: ["mock artist"],
      image: "mock-image",
      popularity: 24,
      release: new Date(),
      reviews: [],
    };

    spyOn(component["http"], "post").and.returnValue(of("Mock Response"));
    // Call the method to create music
    component.createMusic(musicInformation);
  });
});
