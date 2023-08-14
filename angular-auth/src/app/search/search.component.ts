import { Component, EventEmitter, Output} from "@angular/core";
import { SpotifyApiService } from "src/app/spotify.api.service";
import { Router } from "@angular/router";
import { SearchResultService } from "src/app/search-result/search-result.service";
import { SearchService } from "./search.service";
import { HttpClient } from "@angular/common/http";
interface SpotifySearchResponse {
  tracks: {
    items: any[];
  };
}

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"],
})
export class SearchComponent {
  query: string = "";
  loading: boolean = false;
  searchResults: any[] = [];

  constructor(
    private router: Router,
    public searchResultService: SearchResultService,
    public searchService: SearchService,
    private spotifyApiService: SpotifyApiService,
    public http:HttpClient
  ) {}

  async search() {
    if (this.query) {
      this.loading = true;
      const apiUrl = 'http://localhost:3000';
      const searchUrl = `${apiUrl}/spotify/search/${encodeURIComponent(this.query)}`;
  
      try {
        const response: SpotifySearchResponse | undefined = await this.http.get<SpotifySearchResponse>(searchUrl).toPromise();
        const tracks = response?.tracks?.items?.map((item: any) => // Optional chaining
          this.spotifyApiService.mapTrackInfo(item)
        ) ?? [];
        this.processTracks(tracks);
        this.router.navigate(['/searchResult']);
      } catch (error) {
        console.error('Error searching music:', error);
      }
    } else {
      this.clearSearchResults();
    }
  }
  
  
  
  processTracks(tracks: any[]): void {
    this.searchResultService.updateSearchResults(tracks);
    this.searchResultService.saveSearchResultsToLocalStorage();
  }

  clearSearchResults(): void {
    this.searchResultService.clearSearchResults();
  }

  onKeyUp(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.search();
    }
  }
}
