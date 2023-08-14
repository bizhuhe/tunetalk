import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AlbumDataService } from './album-data.service';

describe('AlbumDataService', () => {
  let service: AlbumDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AlbumDataService]
    });

    service = TestBed.inject(AlbumDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store and retrieve album', () => {
    const mockAlbum = { id: '1', name: 'Test Album' };

    service.setAlbum(mockAlbum);
    expect(service.getAlbum()).toEqual(mockAlbum);
  });

  it('should retrieve album from local storage if not in memory', () => {
    const mockAlbum = { id: '1', name: 'Test Album' };

    localStorage.setItem('albumState', JSON.stringify(mockAlbum));
    expect(service.getAlbum()).toEqual(mockAlbum);
  });
  it('should return null when album is not in memory and not in local storage', () => {
    // Clean localStorage and ensure that this.album is null
    localStorage.clear();
    service['album'] = null;
  
    expect(service.getAlbum()).toBeNull();
  });
  
  it('should make GET request to retrieve album by id', () => {
    const mockAlbum = { id: '1', name: 'Test Album' };
    const albumId = '1';

    // Call getAlbumById(), it returns an Observable so needs to subscribe it
    service.getAlbumById(albumId).subscribe(album => {
      expect(album).toEqual(mockAlbum);
    });

    const req = httpMock.expectOne(`http://localhost:3000/music/${albumId}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockAlbum);
  });
});
