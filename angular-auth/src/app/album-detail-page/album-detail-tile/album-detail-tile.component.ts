import { Component } from "@angular/core";
import { AlbumDataService } from "../../album-data.service";
import { HttpClient } from "@angular/common/http";
import { Subscription } from "rxjs";

@Component({
  selector: "app-album-detail-tile",
  templateUrl: "./album-detail-tile.component.html",
  styleUrls: ["./album-detail-tile.component.css"],
})
export class AlbumDetailTileComponent {
  album: any;
  private subscription: Subscription = new Subscription();

  constructor(
    private albumDataService: AlbumDataService,
    private http: HttpClient
  ) {}
  ngOnInit() {
    this.album = this.albumDataService.getAlbum();
    this.createMusic(this.createMusicInformation());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

 
  createMusic(musicInformation: any) {
    this.http
      .post("http://localhost:3000/music", musicInformation, {
        responseType: "json",
      })
      .subscribe((response) => {
        console.log("Music creation response:", response);
      });
  }

  createMusicInformation() {
    const musicInformation = {
      id: this.album.id,
      musicName: this.album.name,
      artists: this.album.artists,
      image: this.album.image,
      popularity: this.album.popularity,
      release: this.album.release,
      reviews: [],
    };
    return musicInformation;
  }

  
}
