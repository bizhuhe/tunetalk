import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { OidcSecurityService } from "angular-auth-oidc-client";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { ReplaySubject } from 'rxjs';
interface AuthConfig {
  isAuthenticated: boolean;
  userData: any;
}

@Injectable({
  providedIn: "root",
})

export class AuthorizeService {
  userProfile: any;
  isAuthenticated = false;
  userAvatar : '';
  userName = '';
  email = '';
  email$ = new BehaviorSubject<string>(null);
  currentUser: any;
  public authStatusSubject = new ReplaySubject<boolean>(1);
  public authStatus = this.authStatusSubject.asObservable();

  constructor(
    private oidcSecurityService: OidcSecurityService,
    private http: HttpClient,
    private router: Router
  ) {
    this.oidcSecurityService
      .checkAuth()
      .subscribe((config: AuthConfig) => this.handleAuthentication(config));
  }
  
  private handleAuthentication({ isAuthenticated, userData }: AuthConfig): void {
    this.authStatusSubject.next(isAuthenticated);
    this.isAuthenticated = isAuthenticated;
    console.log("user authenticated", this.isAuthenticated);
    if (isAuthenticated && userData) {
      this.setUserDetails(userData);
      this.makeLoginCall();
      this.redirectToPreviousRoute();
      this.currentUser = userData;
    }
  }
  
  private setUserDetails(userData: any): void {
    this.userName = userData.name;
    this.email = userData.email;
    this.email$.next(this.email);
  }
  // this method is to call the login backend
  // so that the user info can be pared into the db right away
  public makeLoginCall(): void {
    const userInformation = {
      name: this.userName,
      email: this.email,
      
    };
    console.log("user info ", userInformation);
    this.http
      .post("http://localhost:3000/user/login", userInformation, {
        responseType: "text",
      })
      .subscribe((response) => {
        console.log("login response: ", response);
      });
  }
  login() {
    // store the previous route before login in local storage for future retrieval
    localStorage.setItem("previousLoginRoute", this.router.url);
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService.logoff().subscribe((result) => {
      console.log(result);
    });
  }
  // This method retrieves the stored URL and redirects the user there
  private redirectToPreviousRoute(): void {
    const previousLoginRoute = localStorage.getItem("previousLoginRoute");
    if (previousLoginRoute) {
      this.router.navigateByUrl(previousLoginRoute);
      localStorage.removeItem("previousLoginRoute");
    } else {
      this.router.navigateByUrl("/"); // redirect to default page
    }
  }
}
