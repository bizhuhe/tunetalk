import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StsConfigLoader, ConfigurationService } from 'angular-auth-oidc-client';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let mockStsConfigLoader: any;
  let mockConfigurationService: any;
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
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: StsConfigLoader, useValue: mockStsConfigLoader },
        { provide: ConfigurationService, useValue: mockConfigurationService }
      ],
      declarations: [AppComponent]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'angular-auth'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('angular-auth');
  });

});
