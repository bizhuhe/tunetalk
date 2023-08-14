import { Injectable } from "@angular/core";
import { SpotifyApiService } from "../spotify.api.service";
import { HttpClient } from "@angular/common/http";
import { TRENDING_SONGS } from "../constants/albumIds";

@Injectable({
  providedIn: "root",
})
export class TunetalkService {
  albumIdArray: any[] = [];
 

  constructor(
    private spotifyApiService: SpotifyApiService,
    private http: HttpClient
  ) {}



  async getTrendingSongs() {
    try {
      this.albumIdArray = await this.spotifyApiService.getPlaylist(
        TRENDING_SONGS
      );
    } catch (error) {
      console.error("Error fetching trending songs:", error);
    }
  }
}
