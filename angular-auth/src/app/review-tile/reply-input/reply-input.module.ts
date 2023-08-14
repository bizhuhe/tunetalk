import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ReplyInputComponent } from './reply-input.component';
import { RatingModule } from 'primeng/rating';

@NgModule({
  declarations: [ReplyInputComponent],
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    RatingModule
  ],
  exports: [ReplyInputComponent],
})
export class ReplyInputModule { }