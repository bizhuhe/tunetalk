import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class SpotifyApiService {
  albumIdArray: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  // this method is used to format the album details
  // by bringing it as a separate method, it's more modular and easier to edit
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


  async getPlaylist(playListId: string): Promise<any[]> {
    const apiUrl = "http://localhost:3000"; 
    try {
      const songs = await this.http
        .get<any[]>(`${apiUrl}/spotify/processed-songs/${playListId}`)
        .toPromise();
      if (songs === undefined) {
        // Handle the case when songs is undefined
        throw new Error("No songs found for the playlist.");
      }
      return songs;
    } catch (error) {
      console.error("Error fetching trending songs:", error);
      throw new Error("Error fetching trending songs.");
    }
  }
}