import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AlbumTileComponent } from './album-tile.component';

@NgModule({
  declarations: [AlbumTileComponent],
  imports: [
    CommonModule,
    ButtonModule
  ],
  exports: [AlbumTileComponent],
})
export class AlbumTileModule { }
