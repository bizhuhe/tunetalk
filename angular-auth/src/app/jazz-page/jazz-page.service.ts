import { Injectable } from "@angular/core";
import { SpotifyApiService } from "../spotify.api.service";
import { HttpClient } from "@angular/common/http";
import { JAZZ } from "../constants/albumIds";

@Injectable({
  providedIn: "root",
})
export class JazzService {
  albumIdArray: any[] = [];
 

  constructor(
    private spotifyApiService: SpotifyApiService
  ) {}

  async getJazzMusic() {
    try {
      this.albumIdArray = await this.spotifyApiService.getPlaylist(
        JAZZ
      );
    } catch (error) {
      console.error("Error fetching trending songs:", error);
    }
  }
}