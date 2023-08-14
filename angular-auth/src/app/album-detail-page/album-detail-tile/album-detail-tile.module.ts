import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AlbumDetailTileComponent } from './album-detail-tile.component';
import { NavbarModule } from '../../navbar/navbar.module';
import { ReviewInputModule } from '../review-input/review-input.module';
@NgModule({
  declarations: [AlbumDetailTileComponent],
  imports: [
    CommonModule,
    ButtonModule,
    NavbarModule,
    ReviewInputModule
  ],
  exports: [AlbumDetailTileComponent],
})
export class AlbumDetailTileModule { }
