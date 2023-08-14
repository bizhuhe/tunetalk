import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SpotifyApiService } from 'src/app/spotify.api.service';

@Injectable({
  providedIn: 'root'
})
export class SearchResultService {
  searchResults: any[] = [];
  uniqueSongs: any[] = [];
  searchData: any[] = [];
  constructor(private http: HttpClient, private spotifyApiService: SpotifyApiService,) {
  }

  updateSearchResults(results: any[]) {
    this.searchResults = results;
    // Save search results to localStorage
    localStorage.setItem('searchResults', JSON.stringify(results));
  }

  updateUniqueSongs(songs: any[]) {
    this.uniqueSongs = songs;
  }


  saveSearchResultsToLocalStorage() {
   localStorage.setItem('searchResults', JSON.stringify(this.searchResults));
  }
  getSearchResults(): Observable<any[]> {
    const storedResults = localStorage.getItem('searchResults');
  
    if (storedResults) {
      // If results are found in localStorage, update the search results and return them as an Observable
      this.searchResults = JSON.parse(storedResults);
      return of(this.searchResults);
    } 
    else {
      // If no results found, return an empty array as an Observable
      return of([]);
    }
  }

  clearSearchResults(): void {
    this.searchResults = [];
  }
  
}
