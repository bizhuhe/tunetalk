import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReplyInputComponent } from "./reply-input.component";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { StsConfigLoader } from "angular-auth-oidc-client";
import { of } from "rxjs";
import { FormsModule, NgForm } from "@angular/forms";
import { InputService } from "src/app/input.service";

describe("ReplyInputComponent", () => {
  let component: ReplyInputComponent;
  let fixture: ComponentFixture<ReplyInputComponent>;
  let mockAuthorizeService: any;
  let mockStsConfigLoader: any;
  let mockInputService: any;
  let httpTestingController: HttpTestingController;
  const mockDate = new Date();
  const mockReply = {
    user: "mockUserId",
    userName: "Mock User",
    reply: "this is a reply",
    review: "mockId1",
    createdAt: mockDate,
  };

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
    mockAuthorizeService = {
      email: "test@email.com",
      userName: "testUser",
    };
    mockInputService = {
      editInput: jasmine
        .createSpy("editInput")
        .and.callFake((component: any, currentInput: any) => {
          component.reply = { ...currentInput };
          component.replyBeingEdited = currentInput;
          component.editing = true;
        }),
      resetForm: jasmine
        .createSpy("resetForm")
        .and.callFake((component: any, form: NgForm) => {
          component.reply = {};
          component.editing = false;
          component.replyBeingEdited = undefined;
        }),
    };

    TestBed.configureTestingModule({
      declarations: [ReplyInputComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [
        { provide: StsConfigLoader, useValue: mockStsConfigLoader },
        { provide: InputService, useValue: mockInputService },
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ReplyInputComponent);
    component = fixture.componentInstance;
    component.reply = {
      user: "mockUserId",
      userName: "Mock User",
      reply: "this is a reply",
      review: "mockId1",
      createdAt: mockDate,
    };
    component.review = {
      _id: "mockId1",
      user: "mockUserId",
      userName: "Mock User",
      song: "mockSongId",
      songName: "Mock Song",
      image: "mock-image.png",
      rating: 3,
      comment: "a new mock review",
      likes: 1,
      likedByUsers: [],
      replies: [],
      createdAt: new Date("2020-01-01"),
    };
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set editing to true when newReviewClick is called", () => {
    expect(component.editing).toBeFalse();
    component.newReplyClick();
    expect(component.editing).toBeTrue();
  });
  it("should create reply information", () => {
    const replyInformation = component.createReplyInformation();
    expect(replyInformation.review).toEqual(component.review._id);
    expect(replyInformation.createdAt).toBeTruthy();
  });

  it("should set editing to true and update the review when editReview is called", () => {
    expect(component.editing).toBeFalse();
    component.editReply(mockReply);

    expect(component.editing).toBeTrue();
    expect(component.reply).toEqual(mockReply);
    expect(component.replyBeingEdited).toEqual(mockReply);
  });
  it("should reset the form", () => {
    component.editing = true;
    const mockForm = {
      valid: true,
    } as NgForm;

    component.resetForm(mockForm);
    expect(component.editing).toBeFalse();
    expect(component.reply).toEqual({});
    expect(component.replyBeingEdited).toBeUndefined();
  });
  it("should create a reply and reset form when submitForm is called with a valid form and a reply", () => {
    const mockForm = {
      valid: true,
    } as NgForm;
    const replyInformation = {
      ...mockReply,
      reply: "this is a new reply"
    };
  
    // Spying on the methods
    spyOn(component, 'createReplyInformation').and.returnValue(replyInformation);
    spyOn(component, 'createReply');
    spyOn(component, 'resetForm');
    spyOn(component.replySubmitted, 'emit');
  
    // Setting initial state
    component.reply.reply = "this is a new reply";
    component.formSubmitted = false;
  
    component.submitForm(mockForm);
  
    expect(component.createReplyInformation).toHaveBeenCalled();
    expect(component.createReply).toHaveBeenCalledWith(replyInformation);
    expect(component.resetForm).toHaveBeenCalledWith(mockForm);
    expect(component.formSubmitted).toBeTrue();
    expect(component.replySubmitted.emit).toHaveBeenCalled();

    // Expecting the HTTP request
  
  });

  
});
