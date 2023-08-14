import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StsConfigLoader, ConfigurationService } from 'angular-auth-oidc-client';
import { of , Observable} from 'rxjs';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthorizeService } from '../auth.service';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockStsConfigLoader: any;
  let mockConfigurationService: any;
  let mockRouter: Router;
  let mockAuthorizeService: any;

  beforeEach(() => {
    mockStsConfigLoader = {
      loadConfigs: jasmine.createSpy('loadConfigs').and.returnValue(of({ 
        clientId: 'mockClientId',
        server: 'mockServer',
        redirectUrl: 'mockRedirectUrl'
      }))
    };

    mockConfigurationService = {
      getOpenIDConfigurations: jasmine.createSpy('getOpenIDConfigurations').and.returnValue(of({ /* mock return data */ })),
    };

    mockAuthorizeService = {
      authStatus: new Observable(subscriber => subscriber.next(true)),
      email$: of('test@example.com'), 
      login: jasmine.createSpy('login'),
      logout: jasmine.createSpy('logout')
    };
  
  
    TestBed.configureTestingModule({
      declarations: [NavbarComponent, ThemeSwitcherComponent],
      imports:[HttpClientTestingModule],
      providers: [
        { provide: StsConfigLoader, useValue: mockStsConfigLoader },
        { provide: ConfigurationService, useValue: mockConfigurationService },
        { provide: AuthorizeService, useValue: mockAuthorizeService },
      ],
    });

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate back when navigateBack is called', () => {
    const locationSpy = spyOn(TestBed.inject(Location), 'back');
    component.navigateBack();
    expect(locationSpy).toHaveBeenCalled();
  });

  it ('should navigate to home page when navigateToHome is called', () => {
    const mockRouter = TestBed.inject(Router);
    spyOn(mockRouter, 'navigate');
    component.navigateToHome();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tunetalk']);
  });

  it ('should navigate to review page when navigateToReviews is called', () => {
    const mockRouter = TestBed.inject(Router);
    spyOn(mockRouter, 'navigate');
    component.navigateToReviews();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/reviews']);
  });

  it ('should navigate to profile page when openProfile is called', () => {
    const mockRouter = TestBed.inject(Router);
    spyOn(mockRouter, 'navigate');
    component.openProfile();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile']);
  });

  it('should call authorizeService.login() when login is called', () => {
    component.login();
    expect(mockAuthorizeService.login).toHaveBeenCalled();
  });

  it('should call authorizeService.logout() and log to console when logout is called', () => {
    spyOn(console, 'log');
    component.logout();
    expect(mockAuthorizeService.logout).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('successfully loggedout');
  });

  it('should toggle dropdownVisible when toggleDropdown is called', () => {
    component.dropdownVisible = false;
    component.toggleDropdown();
    expect(component.dropdownVisible).toBeTrue();

    component.dropdownVisible = true;
    component.toggleDropdown();
    expect(component.dropdownVisible).toBeFalse();
  });
});
