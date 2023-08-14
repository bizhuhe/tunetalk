import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TunetalkComponent } from './tunetalk.component';
import { CarouselModule } from './carousel/carousel.module';
import { NavbarModule } from '../navbar/navbar.module';
import { SearchModule } from '../search/search.module';
import { AlbumTileModule } from './album-tile/album-tile.module';

@NgModule({
  declarations: [
    TunetalkComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NavbarModule,
    SearchModule,
    AlbumTileModule,
    CarouselModule
  ]
})
export class TuneTalkModule { }
