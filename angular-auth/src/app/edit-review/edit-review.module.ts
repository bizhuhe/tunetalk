import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { EditReviewComponent } from './edit-review.component';
import { RatingModule } from 'primeng/rating';

@NgModule({
  declarations: [EditReviewComponent],
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    RatingModule
  ],
  exports: [EditReviewComponent],
})
export class EditReviewModule { }
