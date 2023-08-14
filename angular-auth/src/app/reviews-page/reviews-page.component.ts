
import { Component, OnInit, OnDestroy,ChangeDetectorRef, Input } from '@angular/core';
import { Review } from '../review-data.service';
import { ReviewDataService } from '../review-data.service';
import { Router } from '@angular/router';
import { AuthorizeService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reviews-page',
  templateUrl: './reviews-page.component.html',
  styleUrls: ['./reviews-page.component.css'],
})
export class ReviewsPageComponent implements OnInit, OnDestroy {
  public subscription: Subscription = new Subscription();
  pageNumber: number = 1;
  pageSize: number = 20;
  totalReviews: number;
  searchTerm: string = '';
  constructor(
    public reviewDataService: ReviewDataService,
    public authorizeService: AuthorizeService,
    private router: Router,private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadReviews();
    this.reviewDataService.subscribeToReviewUpdates();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

    handleEditingChange(editing: any) {
    if (!editing) {
      this.subscription.unsubscribe();
    }
  }
  loadReviews(): void {
    this.reviewDataService.getAllReviews().subscribe(
      (response: Review[]) => {
        this.reviewDataService.reviews = response
          .map((review) => ({
            ...review,
            createdAt: new Date(review.createdAt),
          }))
          .filter((review) =>
          (review.comment ? review.comment.toLowerCase().includes(this.searchTerm.toLowerCase()) : false) ||
          (review.user ? review.user.toLowerCase().includes(this.searchTerm.toLowerCase()) : false) ||
          (review.userName ? review.userName.toLowerCase().includes(this.searchTerm.toLowerCase()) : false) ||
          (review.songName ? review.songName.toLowerCase().includes(this.searchTerm.toLowerCase()) : false)
            
          )
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      },
      (error) => {
        console.log('Error occurred while retrieving reviews:', error);
      }
    );
  }
  


  openAlbumTile(id: string): void {
    this.router.navigate(['/album-details', id]);
  }
  getDisplayedReviews() {
    const start = (this.pageNumber - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.reviewDataService.reviews.slice(start, end);
  }

  previousPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
    }
  }

  nextPage() {
    if (this.pageNumber < this.getTotalPages()) {
      this.pageNumber++;
    }
  }

  getTotalPages() {
    return Math.ceil(this.reviewDataService.reviews.length / this.pageSize);
  }
}
