import { Injectable } from "@angular/core";
import { SpotifyApiService } from "../spotify.api.service";
import { RAP } from "../constants/albumIds";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class RapService {
  albumIdArray: any[] = [];
 

  constructor(
    private spotifyApiService: SpotifyApiService,
  ) {}

  async getRapMusic() {
    try {
      this.albumIdArray = await this.spotifyApiService.getPlaylist(
        RAP
      );
    } catch (error) {
      console.error("Error fetching trending songs:", error);
    }
  }

}
