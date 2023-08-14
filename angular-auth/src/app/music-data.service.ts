import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from './review-data.service';
export interface Music {
    id: string;
    musicName: string;
    artists: string[];
    image: string;
    popularity: Number;
    release: Date;
    // reviews: [Review];
    reviews:[string];
  }
@Injectable({
  providedIn: 'root'
})

  
export class MusicDataService {
    music: Music[] = [];
  constructor(private http: HttpClient) {}

  getAllMusic(): Observable<Music[]> {
    return this.http.get<Music[]>('http://localhost:3000/music');
  }
}
