import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserDataService, User } from './user-data.service';
import { RouterTestingModule } from '@angular/router/testing';
import { StsConfigLoader } from "angular-auth-oidc-client";
import { of } from 'rxjs';
import { LogLevel, AbstractLoggerService } from 'angular-auth-oidc-client';
import { AuthorizeService } from './auth.service';

describe('UserDataService', () => {
  let service: UserDataService;
  let httpMock: HttpTestingController;
  let mockUser1: User;
  let mockUser2: User;
  let mockStsConfigLoader: any;
  let authorizeServiceSpy: jasmine.SpyObj<AuthorizeService>;

  const mockAuthorizeService = {
    isAuthenticated: true,
    email: "test@example.com",
  };
  beforeEach(() => {
    mockStsConfigLoader = {
      loadConfigs: jasmine.createSpy("loadConfigs").and.returnValue(
        of([
          {
            clientId: "mockClientId",
            server: "mockServer",
            redirectUrl: "mockRedirectUrl",
          }
        ])
      ),
    };
    const mockLoggerService = {
      logError: () => {},
      logDebug: () => {},
      logWarning: () => {},
      logVerbose: () => {},
      log: () => {},
    };
    
    mockUser1= {  
        _id:"mockUser",
        email: "test@gmail.com",
        name: "test user",
        bio: "I got nothing to say",
        createdAt: new Date(),
        avatar: "mock-image",
        reviews :[]

    }
    mockUser2= {  
        _id:"mockUser2",
        email: "test2@gmail.com",
        name: "test user2",
        bio: "I got nothing to say",
        createdAt: new Date(),
        avatar: "mock-image",
        reviews :[]

    }
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,RouterTestingModule],
      providers: [UserDataService, 
        { provide: AuthorizeService, useValue: mockAuthorizeService },
        { provide: StsConfigLoader, useValue: mockStsConfigLoader },
        { provide: AbstractLoggerService, useValue: mockLoggerService },]
    });

    service = TestBed.inject(UserDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all users', () => {
    const mockUsers: User[] = [
      mockUser1, mockUser2
    ];

    service.getAllUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('http://localhost:3000/user');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should get current user by email', async () => {
    const email = 'test@example.com';

    service.getCurrentUser(email).then(user => {
      expect(user).toEqual(mockUser1);
    });

    const req = httpMock.expectOne(`http://localhost:3000/user/email/${email}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser1);
  });
  it('should get current user by ID', async () => {
    const userId = 'testUserId';
    const mockUser: User = {
      _id: 'testUserId',
      email: 'test@example.com',
      name: 'Test User',
      bio: 'I am a test user',
      createdAt: new Date(),
      avatar: 'avatar.jpg',
      reviews: [],
    };

    // Call the method to get current user by ID
    const promise = service.getCurrentUserById(userId);

    const req = httpMock.expectOne(`http://localhost:3000/user/id/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
    const user = await promise;

    // Expect that the returned user matches the mockUser
    expect(user).toEqual(mockUser);
  });



  it('should edit user', () => {
    const userId = 'testUserId';
    const updatedUser: any = {
    };

    service.editUser(userId, updatedUser).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`http://localhost:3000/user/id/${userId}`);
    expect(req.request.method).toBe('PUT');
    req.flush({}); 
  });


  it('should emit review updated', () => {
    const emitSpy = spyOn(service.userUpdated, 'emit');

    service.emitReviewUpdated(mockUser1);
    expect(emitSpy).toHaveBeenCalledWith(mockUser1);
  });
});
