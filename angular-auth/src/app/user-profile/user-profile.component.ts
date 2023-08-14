import { Component } from "@angular/core";
import { AuthorizeService } from "../auth.service";
import { HttpClient } from "@angular/common/http";
import { NgForm } from "@angular/forms";
import { UserDataService, User } from "../user-data.service";
import { ReviewDataService } from "../review-data.service";
import { Review } from "../review-data.service";
import { Subscription } from "rxjs";
@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent {
  email = "";
  user: any = {
    bio: "",
  };

  userBeingEdited: any;
  initialBio: string = "";
  editingBio = false;
  editingAvatar = false;
  selectedFile?: File;

  selectedFileName: string = "";
  public subscription: Subscription = new Subscription();

  constructor(
    public authorizeService: AuthorizeService,
    public userDataService: UserDataService,
    public reviewDataService: ReviewDataService,
    public http: HttpClient
  ) {}

  ngOnInit() {
    if (this.authorizeService.isAuthenticated) {
      this.loadUserData();
      this.reviewDataService.subscribeToReviewUpdates();
    }
  }
   loadUserData(): void {
    this.email = this.authorizeService.email;
    console.log("the user email", this.email);
    this.userDataService.getCurrentUser(this.email).then((user: User) => {
      this.user = user;
      this.initialBio = user.bio;
      this.loadReviews();
    });
  }

  loadReviews(){
    this.reviewDataService.loadReviews(this.user._id);

  }
  updateBio(form: NgForm) {
    if (form.valid) {
      const updatedUser = {
         bio: this.user.bio,
      };
      console.log("the updatedUser ", updatedUser);
      this.updateUser(updatedUser);
      const initialBioValue = this.initialBio;

      form.resetForm();
      this.editingBio = false;
      this.initialBio = "";
    }
  }
  updateAvatar(form: NgForm) {
    console.log("form submitted");
    if (form.valid) {
      const updatedAvatar = {
        avatar: this.selectedFile,
        bio: this.user.bio,
      };
      this.updateUser(updatedAvatar);
      this.editingAvatar = false;
    }
  }

  onFileSelect(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.selectedFileName = file.name; // Assigning the name of the file

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFile = e.target.result; // Assigning base64 string to selectedFile
      };
      reader.readAsDataURL(file);
    }
  }

  editReview(currentUser: any) {
    this.user = { ...currentUser };
    this.userBeingEdited = currentUser;
    this.editingBio = true;
  }
  resetForm(form: NgForm) {
    this.user = {};
    this.editingBio = false;
    this.userBeingEdited = undefined;
  }
  openAvatarInput() {
    this.editingAvatar = !this.editingAvatar;
  }

  openBioInput() {
    this.editingBio = !this.editingBio;
  }

  updateUser(userInformation: any) {
    const updatedUser = {
      email: this.user.email,
      name: this.user.name,
      avatar: this.user.avatar,
      reviews: this.user.reviews,
      ...userInformation,
    };
    this.http
      .put(`http://localhost:3000/user/id/${this.user._id}`, updatedUser, {
        responseType: "text",
      })
      .subscribe((response) => {
        console.log("Review update response: ", response);
        this.userDataService.getCurrentUser(this.email).then((user: User) => {
          this.user = user;
          this.initialBio = user.bio;
        });
      });
    this.userDataService.emitReviewUpdated(updatedUser);
  }
  handleReviewDeleted() {
    console.log("Received reviewDeleted event");
    this.loadReviews();
  }
  handleEditingChange(editing: any) {
    if (!editing) {
      this.subscription.unsubscribe();
    }
  }
}
