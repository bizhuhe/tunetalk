import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AlbumDetailPageComponent } from './album-detail-page.component';
import { NavbarModule } from '../navbar/navbar.module';
import { ReviewInputModule } from './review-input/review-input.module';
import { AlbumDetailTileModule } from './album-detail-tile/album-detail-tile.module';
import { CurrentAlbumReviewsModule } from './current-album-reviews/current-album-reviews.module';
import { SearchModule } from '../search/search.module';
import { RatingBoardModule } from './rating-board/rating-board.module';
@NgModule({
  declarations: [AlbumDetailPageComponent],
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    NavbarModule,
    ReviewInputModule,
    AlbumDetailTileModule,
    CurrentAlbumReviewsModule,
    SearchModule,
    RatingBoardModule

  ],
  exports: [AlbumDetailPageComponent],
})
export class AlbumDetailPageModule { }
