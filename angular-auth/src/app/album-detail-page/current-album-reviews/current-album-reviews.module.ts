import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import {  RatingModule } from "primeng/rating";
import { CurrentAlbumReviewsComponent } from "./current-album-reviews.component";
import { ReviewTileModule } from "src/app/review-tile/review-tile.module";
@NgModule({
  declarations: [CurrentAlbumReviewsComponent],
  imports: [CommonModule, ButtonModule, RatingModule,ReviewTileModule],
  exports: [CurrentAlbumReviewsComponent],
})
export class CurrentAlbumReviewsModule {}
