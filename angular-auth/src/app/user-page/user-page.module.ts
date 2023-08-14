import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPageComponent } from './user-page.component';
import { NavbarModule } from '../navbar/navbar.module';
import { FormsModule } from '@angular/forms';
import { ReviewTileModule } from '../review-tile/review-tile.module';

@NgModule({
  declarations: [UserPageComponent],
  imports: [CommonModule, NavbarModule, FormsModule, ReviewTileModule],
  exports: [UserPageComponent],
})
export class UserPageModule {}
