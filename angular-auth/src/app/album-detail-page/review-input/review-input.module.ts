import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ReviewInputComponent } from './review-input.component';
import { RatingModule } from 'primeng/rating';

@NgModule({
  declarations: [ReviewInputComponent],
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    RatingModule
  ],
  exports: [ReviewInputComponent],
})
export class ReviewInputModule { }
