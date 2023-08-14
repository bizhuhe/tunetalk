import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDialogComponent } from './login-dialog.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StsConfigLoader } from 'angular-auth-oidc-client';
import { of } from 'rxjs';
import { AuthorizeService } from '../auth.service';
describe('LoginDialogComponent', () => {
  let component: LoginDialogComponent;
  let fixture: ComponentFixture<LoginDialogComponent>;
  let mockAuthorizeService: any;
  let mockStsConfigLoader = {
    loadConfig: jasmine.createSpy('loadConfig').and.returnValue(of({ 
      clientId: 'mockClientId',
      server: 'mockServer',
      redirectUrl: 'mockRedirectUrl'
    })),
    loadConfigs: jasmine.createSpy('loadConfigs').and.returnValue(of({ /* mock return data */ }))
  };


  beforeEach(() => {
    mockAuthorizeService = jasmine.createSpyObj('AuthorizeService', ['login', 'logout']);

    TestBed.configureTestingModule({
      declarations: [LoginDialogComponent],
      imports:[MatDialogModule, HttpClientTestingModule],
      providers: [
        { provide: StsConfigLoader, useValue: mockStsConfigLoader },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        {provide: MAT_DIALOG_DATA, useValue: {}},
        { provide: AuthorizeService, useValue: mockAuthorizeService },
      ],
    });
    fixture = TestBed.createComponent(LoginDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call MatDialogRef close method when closeDialog is called', () => {
    const matDialogRef = TestBed.inject(MatDialogRef);
    spyOn(matDialogRef, 'close');

    component.closeDialog();

    expect(matDialogRef.close).toHaveBeenCalled();
  });
  it('should call authorizeService.login() when login is called', () => {
    component.login();
    expect(mockAuthorizeService.login).toHaveBeenCalled();
  });
});
