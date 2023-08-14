import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import {  RatingModule } from "primeng/rating";
import { RatingBoardComponent } from "./rating-board.component";
import { ReviewTileModule } from "src/app/review-tile/review-tile.module";
import { ChartModule } from 'primeng/chart';
@NgModule({
  declarations: [RatingBoardComponent],
  imports: [CommonModule, ButtonModule, RatingModule,ReviewTileModule, ChartModule],
  exports: [RatingBoardComponent],
})
export class RatingBoardModule {}