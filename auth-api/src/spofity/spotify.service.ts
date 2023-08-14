import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
// export interface SpotifyTrack {
//   tracks: any[]; 
  
// }

@Injectable()
export class SpotifyService {
  private apiUrl = 'https://api.spotify.com/v1';
  private spotifyClientId = '7df113924c854f52ab04b38533cac6ab';
  private spotifyClientSecret = '056998e226d2453aaac1441a2f1c212e';

  constructor(private httpService: HttpService) {}

  mapTrackInfo(item: any): any {
    return {
      id: item.id,
      artists: item.artists.map((artist: any) => artist.name),
      url: item.external_urls ? item.external_urls.spotify : '',
      name: item.name,
      image: item.album.images[0].url,
      albumType: item.album.album_type,
      release: item.album.release_date,
      popularity: item.popularity,
      discNumber: item.disc_number,
      trackNumber: item.track_number,
    };
  }

  async getAccessToken(): Promise<any> {
    const credentials = `${this.spotifyClientId}:${this.spotifyClientSecret}`;
    const encodedCredentials = Buffer.from(credentials).toString('base64');

    const response = await this.httpService
      .post(
        'https://accounts.spotify.com/api/token',
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${encodedCredentials}`,
          },
        },
      )
      .toPromise();

    return response.data.access_token;
  }

  async getAlbum(albumId: string) {
    const albumUrl = `${this.apiUrl}/albums/${albumId}`;
    const accessToken = await this.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await this.httpService
      .get(albumUrl, { headers })
      .toPromise();

    return response.data;
  }

  async searchSongs(query: string) {
    const searchUrl = `${this.apiUrl}/search?q=${encodeURIComponent(
      query,
    )}&type=track`;
    const accessToken = await this.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await this.httpService
      .get(searchUrl, { headers })
      .toPromise();

    return response.data;
  }
  async getSongs(playlistId: string): Promise<any> {
    const searchUrl = `${this.apiUrl}/playlists/${playlistId}`;
    const accessToken = await this.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      const response: AxiosResponse<any> = await this.httpService.get(searchUrl, { headers }).toPromise()
      console.log("this is the response data ", response.data); 
      return response.data;
    } catch (error) {
      console.error("Error fetching songs:", error);
      throw new Error("Error fetching songs.");
    }
  }
  
  async fetchAndProcessSongs(playlistId: string): Promise<any[]> {
    const processedSongs: any[] = [];
    try {
      const response = await this.getSongs(playlistId);
      console.log("response from fetch method", response);
      const tracks = response.tracks.items;
      console.log("this is tracks", tracks);
  
      for (const trackInfo of tracks) {
        // limit the fetched result to 50 so that the rendering won't take too long
        if (processedSongs.length >= 50) {
          break;
        }
        const currentTrack = this.mapTrackInfo(trackInfo.track);
        processedSongs.push(currentTrack);
      }
    } catch (error) {
      console.error('Error retrieving songs:', error);
      throw new Error('Error retrieving songs.');
    }
    return processedSongs;
  }
  
}
