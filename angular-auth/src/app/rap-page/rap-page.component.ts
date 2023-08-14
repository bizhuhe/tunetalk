import { Component } from '@angular/core';
import { RapService } from './rap-page.service';
import { SpotifyApiService } from '../spotify.api.service';
import { RAP } from '../constants/albumIds';

@Component({
  selector: 'app-rap-page',
  templateUrl: './rap-page.component.html',
  styleUrls: ['../tunetalk/tunetalk.component.css']
})
export class RapPageComponent {
  constructor(  public rapService: RapService,private spotifyApiService: SpotifyApiService){

  }

  async ngOnInit() {
    await this.rapService.getRapMusic();
  }
}
