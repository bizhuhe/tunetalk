import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SpotifyApiService } from 'src/app/spotify.api.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient, private spotifyApiService: SpotifyApiService, private router: Router) {}


}