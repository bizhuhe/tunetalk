import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarModule } from '../navbar/navbar.module';
import { AlbumTileModule } from '../tunetalk/album-tile/album-tile.module';
import { ReviewsPageComponent } from './reviews-page.component';
import { SearchModule } from '../search/search.module';
import { ReviewTileModule } from '../review-tile/review-tile.module';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [ReviewsPageComponent],
  imports: [CommonModule, NavbarModule, SearchModule, AlbumTileModule, ReviewTileModule,FormsModule],
  exports: [ReviewsPageComponent],
})
export class ReviewsPageModule {}
