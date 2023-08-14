import { Injectable } from "@angular/core";
import { SpotifyApiService } from "../spotify.api.service";
import { ROCK } from "../constants/albumIds";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class RockService {
  albumIdArray: any[] = [];
 

  constructor(
    private spotifyApiService: SpotifyApiService,
  ) {}

  async getRockMusic() {
    try {
      this.albumIdArray = await this.spotifyApiService.getPlaylist(
        ROCK
      );
    } catch (error) {
      console.error("Error fetching trending songs:", error);
    }
  }
}
