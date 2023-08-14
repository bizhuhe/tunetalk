import { TestBed} from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SpotifyApiService } from './spotify.api.service';

describe('SpotifyApiService', () => {
  let service: SpotifyApiService;
  let httpMock: HttpTestingController;
  const mockTrackInfo = {
    id: 'track1',
    artists: ['Artist 1'],
    url: 'https://example.com',
    name: 'Song 1',
    image: 'https://example.com/image1.jpg',
    albumType: 'album_type',
    release: '2023-07-20',
    popularity: 80,
    discNumber: 1,
    trackNumber: 1,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SpotifyApiService],
    });

    service = TestBed.inject(SpotifyApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should map track info correctly', () => {
    const input = {
      id: 'id1',
      artists: [{ name: 'Artist 1' }, { name: 'Artist 2' }],
      external_urls: { spotify: 'http://spotify.com/track1' },
      name: 'Track 1',
      album: {
        images: [{ url: 'http://image.com/1' }],
        album_type: 'type1',
        release_date: '2023-07-28',
      },
      popularity: 90,
      disc_number: 1,
      track_number: 2,
    };
  
    const expectedOutput = {
      id: 'id1',
      artists: ['Artist 1', 'Artist 2'],
      url: 'http://spotify.com/track1',
      name: 'Track 1',
      image: 'http://image.com/1',
      albumType: 'type1',
      release: '2023-07-28',
      popularity: 90,
      discNumber: 1,
      trackNumber: 2,
    };
  
    const output = service.mapTrackInfo(input);
  
    expect(output).toEqual(expectedOutput);
  });
  

  it('should get album information by ID', async () => {
    const playlistId = 'playlist1';
    const mockPlaylistData: any = {
      id: '2QJmrSgbdM35R67eoGQo4j',
      name: 'Album Name',
      artists: ['some singer'],
      image: 'Album Image',
      popularity: 89,
      release: new Date(),
      reviews: []
    };
  
    service.getPlaylist(playlistId).then((data) => {
      expect(data).toEqual(mockPlaylistData);
    });

    const req = httpMock.expectOne(`http://localhost:3000/spotify/processed-songs/${playlistId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPlaylistData);
  });

  
    it('should get songs from a playlist', async () => {
      const playlistId = 'playlist1';
      const mockSongs = ['song1', 'song2', 'song3']; // replace with the actual shape of a song object
  
      service.getPlaylist(playlistId).then((songs) => {
        // Expect the returned data to be the mock songs
        expect(songs).toEqual(mockSongs);
      });
  
      const req = httpMock.expectOne(`http://localhost:3000/spotify/processed-songs/${playlistId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockSongs);
    });
  
    it('should handle the case when no songs are found', async () => {
      const playlistId = 'playlist1';
    
      service.getPlaylist(playlistId).catch((error) => {
        // Expect the error message to be correct
        expect(error.message).toEqual("No songs found for the playlist.");
      });
    
      const req = httpMock.expectOne(`http://localhost:3000/spotify/processed-songs/${playlistId}`);
      expect(req.request.method).toBe('GET');
      req.flush(null); 
    });
    
    it('should handle the case when an error occurs during the http request', async () => {
      const playlistId = 'playlist1';
    
      service.getPlaylist(playlistId).catch((error) => {
        // Expect the error message to be correct
        expect(error.message).toEqual("Error fetching trending songs.");
      });
    
      const req = httpMock.expectOne(`http://localhost:3000/spotify/processed-songs/${playlistId}`);
      expect(req.request.method).toBe('GET');
      req.error(new ErrorEvent('Network error')); // Simulate a network error
    });
    
  
});
