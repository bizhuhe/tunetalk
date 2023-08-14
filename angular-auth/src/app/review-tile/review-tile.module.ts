import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewTileComponent } from './review-tile.component';

import { EditReviewModule } from '../edit-review/edit-review.module';
import { FormsModule } from '@angular/forms';
import { ReplyInputModule } from './reply-input/reply-input.module';

@NgModule({
  declarations: [ReviewTileComponent],
  imports: [CommonModule, EditReviewModule,  FormsModule,ReplyInputModule],
  exports: [ReviewTileComponent],
})
export class ReviewTileModule {}
