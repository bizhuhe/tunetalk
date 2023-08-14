import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RockPageComponent } from './rock-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NavbarComponent } from '../navbar/navbar.component';
import { StsConfigLoader, ConfigurationService } from 'angular-auth-oidc-client';
import { SearchComponent } from '../search/search.component';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
import { of } from 'rxjs';
describe('RockPageComponent', () => {
  let component: RockPageComponent;
  let fixture: ComponentFixture<RockPageComponent>;
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
      declarations: [RockPageComponent, NavbarComponent, SearchComponent, ThemeSwitcherComponent],
      imports:[HttpClientTestingModule, FormsModule],
      providers: [
        { provide: StsConfigLoader, useValue: mockStsConfigLoader },
        { provide: ConfigurationService, useValue: mockConfigurationService }
      ],
    });
    fixture = TestBed.createComponent(RockPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
