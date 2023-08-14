import { Component, OnInit } from '@angular/core';
import { OidcSecurityService, UserDataResult } from 'angular-auth-oidc-client';
import { AuthorizeService } from './auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'angular-auth';
  userData!: UserDataResult;
  isAuthenticated = false;

  constructor(
    public oidcSecurityService: OidcSecurityService,
    private authorizeService: AuthorizeService
  ) {}

  ngOnInit() {

  }
}
