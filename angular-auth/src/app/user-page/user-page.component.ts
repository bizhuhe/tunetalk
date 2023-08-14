import { Component } from "@angular/core";
import { AuthorizeService } from "../auth.service";
import { UserDataService, User } from "../user-data.service";
import { ReviewDataService } from "../review-data.service";
@Component({
  selector: "app-user-page",
  templateUrl: "./user-page.component.html",
  styleUrls: ["./user-page.component.css"],
})
export class UserPageComponent {
  // user: any;
  email = "";
  user: any;
  id = "";
  constructor(
    public authorizeService: AuthorizeService,
    public userDataService: UserDataService,
    public reviewDataService: ReviewDataService
  ) {}

  ngOnInit() {
    this.fetchState();
    // Subscribe to the reviewUpdated event
    this.reviewDataService.subscribeToReviewUpdates();
  }
  fetchState() {
    const state = history.state.user as User;
    if (state) {
      // The user was provided in navigation state.
      console.log("if state true");
      this.user = state;
      this.id = state._id;
      this.loadReviews();
    } else {
      // The user was not provided in navigation state. Need to get it from server.
      if (this.authorizeService.isAuthenticated) {
        this.loadUserData();
      }
    }
  }
  loadUserData(): void {
    this.email = this.authorizeService.email;
    console.log("the user email", this.email);
    this.userDataService.getCurrentUser(this.email).then((user: User) => {
      this.user = user;
      this.id = user._id;
      this.loadReviews();
    });
  }

  loadReviews() {
    this.reviewDataService.loadReviews(this.id);
  }
  handleReviewDeleted() {
    this.loadReviews();
  }
}
