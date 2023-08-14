import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RatingModule } from 'primeng/rating';

import { AuthModule, OpenIdConfiguration } from 'angular-auth-oidc-client';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TuneTalkModule } from './tunetalk/tunetalk.module';
import { AuthorizeService } from './auth.service';
import { SearchResultModule } from './search-result/search-result.module';
import { AlbumDetailTileModule } from './album-detail-page/album-detail-tile/album-detail-tile.module';
import { AlbumDataService } from './album-data.service';
import { ReviewInputModule } from './album-detail-page/review-input/review-input.module';
import { AlbumDetailPageModule } from './album-detail-page/album-detail-page.module';
import { ReviewsPageModule } from './reviews-page/reviews-page.module';
import { RockPageModule } from './rock-page/rock-page.module';
import { CurrentAlbumReviewsModule } from './album-detail-page/current-album-reviews/current-album-reviews.module';
import { JazzPageModule } from './jazz-page/jazz-page.module';
import { RapPageModule } from './rap-page/rap-page.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { ReviewTileModule } from './review-tile/review-tile.module';
import { EditReviewModule } from './edit-review/edit-review.module';
import { UserPageModule } from './user-page/user-page.module';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { ShareReviewDialogComponent } from './share-review-dialog/share-review-dialog.component';
import { ReplyInputModule } from './review-tile/reply-input/reply-input.module';
import { InputService } from './input.service';

export const authConfig: OpenIdConfiguration[] = [
  {
    authority: 'https://a-ci.ncats.io/_api/auth/trainee',
    redirectUrl: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    clientId:
      'client-bizhu',
    responseType: 'code',
    scope: 'openid profile email',
    logLevel: 0, // Adjust log level as needed
    secureRoutes: ['http://localhost:3000/'],
  },

];

@NgModule({
  declarations: [AppComponent, ConfirmDialogComponent, LoginDialogComponent, ShareReviewDialogComponent],

  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    TuneTalkModule,
    SearchResultModule,
    AlbumDetailTileModule,
    ReviewInputModule,
    AlbumDetailPageModule,
    ReviewsPageModule,
    CurrentAlbumReviewsModule,
    BrowserAnimationsModule,
    RatingModule,
    RockPageModule,
    JazzPageModule,
    RapPageModule,
    ReviewTileModule,
    EditReviewModule,
    UserProfileModule,
    UserPageModule,
    MatDialogModule,
    ReplyInputModule,
    AuthModule.forRoot({
      config: authConfig,
    }),
  ],
  providers: [AuthorizeService, AlbumDataService,InputService],
  bootstrap: [AppComponent],
})
export class AppModule {}