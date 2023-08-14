import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
    localStorage.removeItem('darkTheme'); // Clearing localStorage for fresh testing
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('enableDarkTheme', () => {
    it('should add "dark-theme" class and set "darkTheme" in localStorage when enabled', () => {
      service.enableDarkTheme(true);
      expect(document.body.classList.contains('dark-theme')).toBeTrue();
      expect(localStorage.getItem('darkTheme')).toEqual('true');
    });

    it('should remove "dark-theme" class and set "darkTheme" in localStorage when disabled', () => {
      service.enableDarkTheme(false);
      expect(document.body.classList.contains('dark-theme')).toBeFalse();
      expect(localStorage.getItem('darkTheme')).toEqual('false');
    });
  });

  describe('isDarkThemeEnabled', () => {
    it('should return true when "darkTheme" in localStorage is "true"', () => {
      localStorage.setItem('darkTheme', 'true');
      expect(service.isDarkThemeEnabled()).toBeTrue();
    });

    it('should return false when "darkTheme" in localStorage is not "true"', () => {
      localStorage.setItem('darkTheme', 'false');
      expect(service.isDarkThemeEnabled()).toBeFalse();
    });
  });
});
