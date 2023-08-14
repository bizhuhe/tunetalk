
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlbumDetailTileComponent } from './album-detail-tile.component';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NavbarComponent } from 'src/app/navbar/navbar.component';
import { AlbumDataService } from 'src/app/album-data.service';
import { StsConfigLoader } from 'angular-auth-oidc-client';
import { ThemeSwitcherComponent } from 'src/app/theme-switcher/theme-switcher.component';
import { of } from 'rxjs';

describe('AlbumDetailTileComponent', () => {
  let component: AlbumDetailTileComponent;
  let fixture: ComponentFixture<AlbumDetailTileComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let httpTestingController: HttpTestingController;

  let mockStsConfigLoader = {
    loadConfig: jasmine.createSpy('loadConfig').and.returnValue(of({
      clientId: 'mockClientId',
      server: 'mockServer',
      redirectUrl: 'mockRedirectUrl'
    })),
    loadConfigs: jasmine.createSpy('loadConfigs').and.returnValue(of({}))
  };
  const mockAlbum = {
    id: '1',
    name: 'Album Name',
    artists: ['some singer'],
    image: 'Album Image',
    popularity: 89,
    release: new Date(),
    reviews: []
  };
  const albumDataServiceSpy = jasmine.createSpyObj('AlbumDataService', ['getAlbum']);

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    httpClientSpy.post.and.returnValue(of({
      "id": "5sdQOyqq2IDhvmx2lHOpwd",
      "musicName": "Super Shy",
      "artists": ["NewJeans"],
      "image": "https://i.scdn.co/image/ab67616d0000b2733d98a0ae7c78a3a9babaf8af",
      "popularity": 93,
      "release": "2023-07-07T00:00:00.000Z",
      "reviews": [],
      "_id": "64b93d3e75abcc3bb4eaaa5c",
      "__v": 0
    }));
    albumDataServiceSpy.getAlbum.and.returnValue(of(mockAlbum));
    TestBed.configureTestingModule({
      declarations: [AlbumDetailTileComponent, NavbarComponent, ThemeSwitcherComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: StsConfigLoader, useValue: mockStsConfigLoader },
        { provide: AlbumDataService, useValue: albumDataServiceSpy },
        { provide: HttpClient, useValue: httpClientSpy }
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AlbumDetailTileComponent);
    component = fixture.componentInstance;
    component.album = { ...mockAlbum };
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should create music information correctly', () => {
    const expectedMusicInformation = {
      id: mockAlbum.id,
      musicName: mockAlbum.name,
      image: mockAlbum.image,
      popularity: mockAlbum.popularity,
      release: mockAlbum.release,
      artists: mockAlbum.artists,
      reviews: mockAlbum.reviews
    };
    expect(component.createMusicInformation()).toEqual(expectedMusicInformation);
  });

  it('should make a POST request when createMusic is called', () => {
    fixture.detectChanges();
    const musicInformation = mockAlbum; // fill this with some test data
    httpClientSpy.post.and.returnValue(of('Music creation response'));
    component.createMusic(musicInformation);
    expect(httpClientSpy.post).toHaveBeenCalledWith(
      'http://localhost:3000/music',
      musicInformation,
      { responseType: 'json' }
    );
  });
});
