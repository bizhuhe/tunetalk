import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultComponent } from './search-result.component';
import { NavbarModule } from '../navbar/navbar.module';
import { AlbumTileModule } from '../tunetalk/album-tile/album-tile.module';
import { SearchModule } from '../search/search.module';

@NgModule({
  declarations: [SearchResultComponent],
  imports: [CommonModule, NavbarModule, AlbumTileModule, SearchModule],
  exports: [SearchResultComponent],
})
export class SearchResultModule {}
