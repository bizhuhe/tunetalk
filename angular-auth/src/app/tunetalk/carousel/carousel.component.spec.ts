import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselComponent } from './carousel.component';
import { Router } from '@angular/router';

describe('CarouselComponent', () => {
  let component: CarouselComponent;
  let fixture: ComponentFixture<CarouselComponent>;
  let router: jasmine.SpyObj<Router>;

  
  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [CarouselComponent],
      providers: [
        CarouselComponent,
        { provide: Router, useValue: routerSpy }
      ]
    });
    fixture = TestBed.createComponent(CarouselComponent);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;  
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should navigate to rock page', () => {
    component.openRockPage();
    expect(router.navigate).toHaveBeenCalledWith(['/rock']);
  });

  it('should navigate to jazz page', () => {
    component.openJazzPage();
    expect(router.navigate).toHaveBeenCalledWith(['/jazz']);
  });

  it('should navigate to rap page', () => {
    component.openRapPage();
    expect(router.navigate).toHaveBeenCalledWith(['/rap']);
  });
});
