import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RapPageComponent } from './rap-page.component';
import { NavbarModule } from '../navbar/navbar.module';
import { SearchModule } from '../search/search.module';
import { AlbumTileModule } from '../tunetalk/album-tile/album-tile.module';
@NgModule({
  declarations: [
    RapPageComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    NavbarModule,
    SearchModule,
    AlbumTileModule,
  ]
})
export class RapPageModule { }
