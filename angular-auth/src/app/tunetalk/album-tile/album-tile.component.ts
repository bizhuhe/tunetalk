import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Router } from '@angular/router';
import { AlbumDataService } from '../../album-data.service';

@Component({
  selector: 'app-album-tile',
  templateUrl: './album-tile.component.html',
  styleUrls: ['./album-tile.component.css']
})


export class AlbumTileComponent {
  @Input() albumTile: any;
  @Output() openAlbum = new EventEmitter<any>();
  constructor(private router: Router, public albumDataService: AlbumDataService){

  }

  openAlbumTile() {
    this.albumDataService.setAlbum(this.albumTile);
    this.router.navigate(['/album-details', this.albumTile.id], { state: this.albumTile });
  }
}