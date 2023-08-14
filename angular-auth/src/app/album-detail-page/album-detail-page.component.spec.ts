import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AlbumDetailPageComponent } from "./album-detail-page.component";
import { NavbarComponent } from "../navbar/navbar.component"; // Import the NavbarComponent
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { StsConfigLoader } from "angular-auth-oidc-client";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { SearchModule } from "../search/search.module";
import { of, BehaviorSubject } from "rxjs";
import { By } from "@angular/platform-browser";
import { AlbumDataService } from "../album-data.service";
import { AuthorizeService } from "../auth.service";
import { MatDialog } from "@angular/material/dialog";
import { RatingBoardComponent } from "./rating-board/rating-board.component";
import { ThemeSwitcherComponent } from "../theme-switcher/theme-switcher.component";
import { AlbumDetailTileComponent } from "./album-detail-tile/album-detail-tile.component";
import { CurrentAlbumReviewsComponent } from "./current-album-reviews/current-album-reviews.component";
describe("AlbumDetailPageComponent", () => {
  let component: AlbumDetailPageComponent;
  let fixture: ComponentFixture<AlbumDetailPageComponent>;
  let dialog: MatDialog;
  let mockAlbumDataService: any;
  let mockAuthorizeService: any;

  let mockStsConfigLoader = {
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
    popularity: 76,
    release: new Date(),
    reviews: [],
  };
  mockAlbumDataService = {
    getAlbum: jasmine.createSpy("getAlbum").and.returnValue(mockAlbum),
  };
  beforeEach(() => {
    mockAuthorizeService = {
      isAuthenticated: new BehaviorSubject<boolean>(false),  // <-- make this a BehaviorSubject
      email: 'test@example.com',
      authStatus: new BehaviorSubject<boolean>(true),
      email$: new BehaviorSubject<string>('test@example.com'),
      checkAuth: () => of({
        isAuthenticated: true,
        userData: { /* the user data object you expect */ }
      }),
      openLoginDialog: jasmine.createSpy('openLoginDialog'),
      hideReivewInput: jasmine.createSpy('hideReviewInput'),
    };
    

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, SearchModule],
      declarations: [
        AlbumDetailPageComponent,
        NavbarComponent,
        AlbumDetailTileComponent,
        CurrentAlbumReviewsComponent,
        ThemeSwitcherComponent,
        RatingBoardComponent
      ],
      providers: [
        { provide: StsConfigLoader, useValue: mockStsConfigLoader },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: AlbumDataService, useValue: mockAlbumDataService },
        { provide: AuthorizeService, useValue: mockAuthorizeService },
        { provide: MatDialog, useValue: { open: () => {} } },
      ],
    });
    fixture = TestBed.createComponent(AlbumDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockAuthorizeService = TestBed.inject(AuthorizeService);
    dialog = TestBed.inject(MatDialog);
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set the id property in AlbumDetailTileComponent", () => {
    fixture.detectChanges();
    const albumDetailTileComponent = fixture.debugElement.query(
      By.directive(AlbumDetailTileComponent)
    ).componentInstance;
    albumDetailTileComponent.album = { id: 1 /* other properties */ };
    fixture.detectChanges();
    expect(albumDetailTileComponent.album.id).toBe(1);
    albumDetailTileComponent.createMusicInformation(); // Call the method after setting the album property
    // Add your expectations here
  });
  it("should toggle showReviewInput if user is authenticated", () => {
    mockAuthorizeService.isAuthenticated.next(true);
    component.showReviewInput = false;

    component.openReviewInput();

    expect(component.showReviewInput).toBe(true);
  });

  it("should open login dialog if user is not authenticated", () => {
    mockAuthorizeService.isAuthenticated.next(false);
    spyOn(dialog, "open");

    component.openReviewInput();

    // expect(dialog.open).toHaveBeenCalledWith(LoginDialogComponent);
  });

  it("should hide the review input", () => {
    component.showReviewInput = true;
    component.hideReviewInput();
    expect(component.showReviewInput).toBe(false);
  });
});
