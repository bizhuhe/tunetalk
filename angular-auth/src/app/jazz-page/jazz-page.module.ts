import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { JazzPageComponent } from './jazz-page.component';
import { NavbarModule } from '../navbar/navbar.module';
import { SearchModule } from '../search/search.module';
import { AlbumTileModule } from '../tunetalk/album-tile/album-tile.module';
@NgModule({
  declarations: [
    JazzPageComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    NavbarModule,
    SearchModule,
    AlbumTileModule,
  ]
})
export class JazzPageModule { }
