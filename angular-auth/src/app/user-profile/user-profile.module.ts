import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile.component';
import { NavbarModule } from '../navbar/navbar.module';
import { FormsModule } from '@angular/forms';
import { ReviewTileModule } from '../review-tile/review-tile.module';

@NgModule({
  declarations: [UserProfileComponent],
  imports: [CommonModule, NavbarModule, FormsModule, ReviewTileModule],
  exports: [UserProfileComponent],
})
export class UserProfileModule {}
