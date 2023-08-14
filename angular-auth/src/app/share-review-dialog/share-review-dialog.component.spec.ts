import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ShareReviewDialogComponent } from "./share-review-dialog.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { UserDataService, User } from "../user-data.service";
import { of, throwError } from "rxjs";
import { StsConfigLoader } from "angular-auth-oidc-client";

describe("ShareReviewDialogComponent", () => {
  let component: ShareReviewDialogComponent;
  let fixture: ComponentFixture<ShareReviewDialogComponent>;
  let mockDialogRef: MatDialogRef<ShareReviewDialogComponent>;
  let mockUserDataService: UserDataService;
  let mockStsConfigLoader: any;

  beforeEach(() => {
    mockDialogRef = jasmine.createSpyObj(["close"]);
    mockStsConfigLoader = {
      loadConfigs: jasmine.createSpy("loadConfigs").and.returnValue(
        of({
          clientId: "mockClientId",
          server: "mockServer",
          redirectUrl: "mockRedirectUrl",
        })
      ),
    };
    TestBed.configureTestingModule({
      declarations: [ShareReviewDialogComponent],
      imports: [HttpClientTestingModule, MatDialogModule],
      providers: [
        { provide: StsConfigLoader, useValue: mockStsConfigLoader },
        { provide: MatDialogRef, useValue: mockDialogRef },
        UserDataService,
      ],
    });
    fixture = TestBed.createComponent(ShareReviewDialogComponent);
    component = fixture.componentInstance;

    // Get the instance of the UserDataService from the TestBed
    mockUserDataService = TestBed.inject(UserDataService);
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should get user list on initialization", () => {
    const mockUsers: any = {
      _id: "12345",
      email: "mockemail",
      name: "mock name",
      bio: "mock bio",
      createdAt: new Date(),
      avatar: "mock image",
      reviews: [],
    };
    spyOn(mockUserDataService, "getAllUsers").and.returnValue(of(mockUsers));
    // instead of calling getUserList(), call ngOnInit which will call the getUserList() method
    component.ngOnInit();

    expect(mockUserDataService.getAllUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
  });

  it("should handle error when getting user list", () => {
    spyOn(mockUserDataService, "getAllUsers").and.returnValue(
      throwError("Mock error")
    );

    spyOn(console, "error");

    component.getUserList();

    expect(mockUserDataService.getAllUsers).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      "Error occurred while retrieving users:",
      "Mock error"
    );
  });

  it("should close dialog", () => {
    component.closeDialog();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
