import { TestBed, fakeAsync, tick } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { AuthorizeService } from "./auth.service";
import { OidcSecurityService } from "angular-auth-oidc-client";
import { of, ReplaySubject} from "rxjs";
import { Router } from "@angular/router";

describe("AuthorizeService", () => {
  let service: AuthorizeService;
  let oidcSecurityService: OidcSecurityService;
  let httpMock: HttpTestingController;

  beforeEach(() => {

    const mockRouter = {
      navigateByUrl: jasmine.createSpy("navigateByUrl"),
      url: "/test",
    };
    const oidcSpy = jasmine.createSpyObj<OidcSecurityService>(
      "OidcSecurityService",
      ["checkAuth", "authorize", "logoff"]
    );

    // Set up the mock observable for checkAuth method
    const mockUserData = {
      isAuthenticated: true,
      userData: {
        name: "Test User",
        email: "test@example.com",
      },
    };
    (oidcSpy.checkAuth as jasmine.Spy).and.returnValue(of(mockUserData));

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthorizeService,
        { provide: OidcSecurityService, useValue: oidcSpy },
        { provide: Router, useValue: mockRouter },
      ],
    });

    service = TestBed.inject(AuthorizeService);
    oidcSecurityService = TestBed.inject(
      OidcSecurityService
    ) as jasmine.SpyObj<OidcSecurityService>;
    httpMock = TestBed.inject(HttpTestingController);
    spyOn(service, "makeLoginCall").and.callThrough();
     // Reset the ReplaySubject in the service before each test
     service.authStatusSubject = new ReplaySubject<boolean>(1);
     service.authStatus = service.authStatusSubject.asObservable();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
    // Test that there is one HTTP request matching the given URL
    const req = httpMock.expectOne("http://localhost:3000/user/login");
    expect(req.request.method).toBe("POST");
    req.flush({});
  });

  it("login should save current route and authorize", () => {
    const localStorageSpy = spyOn(localStorage, "setItem");
    service.login();

    expect(localStorageSpy).toHaveBeenCalledWith("previousLoginRoute", "/test");
    expect(oidcSecurityService.authorize).toHaveBeenCalled();
    const req = httpMock.expectOne("http://localhost:3000/user/login");
    expect(req.request.method).toBe("POST");
    req.flush({});
  });
  it('logout should logoff', () => {
    (oidcSecurityService.logoff as jasmine.Spy).and.returnValue(of({}));
    service.logout();
    expect(oidcSecurityService.logoff).toHaveBeenCalled();
    const req = httpMock.expectOne("http://localhost:3000/user/login");
    expect(req.request.method).toBe("POST");
    req.flush({});
});
it('redirectToPreviousRoute should navigate to the previous route and remove it from local storage', () => {
    spyOn(localStorage, 'removeItem').and.callThrough();

    // Set a previousLoginRoute in the local storage
    localStorage.setItem('previousLoginRoute', '/previous-route');
    service['redirectToPreviousRoute']();

    expect(service['router'].navigateByUrl).toHaveBeenCalledWith('/previous-route');
    expect(localStorage.removeItem).toHaveBeenCalledWith('previousLoginRoute');

    // Assert that the previousLoginRoute was removed from the local storage
    expect(localStorage.getItem('previousLoginRoute')).toBeNull();
    const req = httpMock.expectOne("http://localhost:3000/user/login");
    expect(req.request.method).toBe("POST");
    req.flush({});
});



});
