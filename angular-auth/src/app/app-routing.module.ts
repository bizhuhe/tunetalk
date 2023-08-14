import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TunetalkComponent } from './tunetalk/tunetalk.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { ReviewsPageComponent } from './reviews-page/reviews-page.component';
import { AlbumDetailPageComponent } from './album-detail-page/album-detail-page.component';
import { RockPageComponent } from './rock-page/rock-page.component';
import { JazzPageComponent } from './jazz-page/jazz-page.component';
import { RapPageComponent } from './rap-page/rap-page.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserPageComponent } from './user-page/user-page.component';
const routes: Routes = [

  { path: '', redirectTo: '/tunetalk', pathMatch: 'full' },
  { path: 'tunetalk', component: TunetalkComponent },
  { path: 'rock', component: RockPageComponent },
  { path: 'jazz', component: JazzPageComponent },
  { path: 'rap', component: RapPageComponent },
  { path: 'searchResult', component: SearchResultComponent },
  {path: 'userPage/:id', component: UserPageComponent},
  { path: 'reviews', component: ReviewsPageComponent },
  {path: 'profile', component: UserProfileComponent},
  { path: 'album-details/:id', component: AlbumDetailPageComponent },
  { path: '**', pathMatch: 'full', component: TunetalkComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
