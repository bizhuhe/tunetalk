import { Component, OnInit } from "@angular/core";
import { TunetalkService } from "./tunetalk.service";
import { SpotifyApiService } from '../spotify.api.service';
import { TRENDING_SONGS } from "../constants/albumIds";


@Component({
  selector: "app-tunetalk",
  templateUrl: "./tunetalk.component.html",
  styleUrls: ["./tunetalk.component.css"],
})
export class TunetalkComponent implements OnInit {
  constructor(
    public tunetalkService: TunetalkService,
    public spotifyApiService: SpotifyApiService,

  ) {}

  async ngOnInit() {
    await this.tunetalkService.getTrendingSongs();
  }
}
