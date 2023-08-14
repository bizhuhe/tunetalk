import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TunetalkComponent } from './tunetalk.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NavbarComponent } from '../navbar/navbar.component';
import { StsConfigLoader, ConfigurationService } from 'angular-auth-oidc-client';
import { SearchComponent } from '../search/search.component';
import { CarouselComponent } from './carousel/carousel.component';
import { of } from 'rxjs';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
describe('TunetalkComponent', () => {
  let component: TunetalkComponent;
  let fixture: ComponentFixture<TunetalkComponent>;
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
      declarations: [TunetalkComponent,NavbarComponent, SearchComponent, CarouselComponent,ThemeSwitcherComponent],
      imports:[HttpClientTestingModule, FormsModule],
      providers: [
        { provide: StsConfigLoader, useValue: mockStsConfigLoader },
        { provide: ConfigurationService, useValue: mockConfigurationService }
      ],
    });
    fixture = TestBed.createComponent(TunetalkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
