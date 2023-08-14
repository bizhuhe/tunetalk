import { Component } from "@angular/core";
import { AuthorizeService } from "../auth.service";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { UserDataService, User } from "../user-data.service";
import { HttpClient } from "@angular/common/http";
@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent {
  dropdownVisible = false;
  userName = "";
  email = "";
  user: any; 
  avatar = "";
  constructor(
    private router: Router,
    private location: Location,
    public authorizeService: AuthorizeService,
    public userDataService: UserDataService,
    private http: HttpClient
  ) {}
  ngOnInit() {
    this.subscribeToAuthStatus();
  }
  
  subscribeToAuthStatus() {
    this.authorizeService.authStatus.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        console.log("Authenticated");
        this.subscribeToEmail();
      }
    });
  }
  
  subscribeToEmail() {
    this.authorizeService.email$.subscribe(email => {
      if(email !== null) {
        console.log("Email received:", email);
        this.getCurrentUser();
      }
    });
  }
  
  getCurrentUser() {
    console.log("In getCurrentUser, email is:", this.authorizeService.email);
    if(this.authorizeService.email !== null) {
      this.userDataService.getCurrentUser(this.authorizeService.email).then((user: User) => {
        this.user = user;
        this.avatar = user.avatar;
      }).catch((error) => {
        console.error("Error getting user:", error);
      });
    }
  }
  
  
  
  navigateBack() {
    this.location.back();
  }
  navigateToHome() {
    this.router.navigate(["/tunetalk"]);
  }
  navigateToReviews() {
    this.router.navigate(["/reviews"]);
  }

  openProfile() {
    this.router.navigate(["/profile"]);
  }

  login() {
    this.authorizeService.login();
  }

  logout() {
    console.log("successfully loggedout");
    this.authorizeService.logout();
  }
  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }
}
