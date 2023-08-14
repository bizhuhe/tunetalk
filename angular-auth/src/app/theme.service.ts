import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root',
  })
  export class ThemeService {
    enableDarkTheme(enable: boolean): void {
      if (enable) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('darkTheme', 'true');
      } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('darkTheme', 'false');
      }
    }
  
    isDarkThemeEnabled(): boolean {
      return localStorage.getItem('darkTheme') === 'true';
    }
  }