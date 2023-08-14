import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SearchResultComponent } from './search-result.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NavbarComponent } from '../navbar/navbar.component';
import { SearchComponent } from '../search/search.component';
import { AlbumTileComponent } from '../tunetalk/album-tile/album-tile.component';
import { StsConfigLoader } from 'angular-auth-oidc-client';
import { of } from 'rxjs';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';

describe('SearchResultComponent', () => {
  let component: SearchResultComponent;
  let fixture: ComponentFixture<SearchResultComponent>;
  let mockStsConfigLoader = {
    loadConfig: jasmine.createSpy('loadConfig').and.returnValue(of({ 
      clientId: 'mockClientId',
      server: 'mockServer',
      redirectUrl: 'mockRedirectUrl'
    })),
    loadConfigs: jasmine.createSpy('loadConfigs').and.returnValue(of({ /* mock return data */ }))
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchResultComponent,NavbarComponent,SearchComponent,AlbumTileComponent, ThemeSwitcherComponent],
      imports:[HttpClientTestingModule,FormsModule],
      providers: [
        { provide: StsConfigLoader, useValue: mockStsConfigLoader },
    
      ],
    });
    fixture = TestBed.createComponent(SearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
