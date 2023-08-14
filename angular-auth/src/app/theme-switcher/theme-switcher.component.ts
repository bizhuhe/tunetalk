import { Component } from '@angular/core';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.css']
})
export class ThemeSwitcherComponent {
  public isDarkThemeEnabled = false;

  constructor(private themeService: ThemeService) {
    this.isDarkThemeEnabled = this.themeService.isDarkThemeEnabled();
    this.themeService.enableDarkTheme(this.isDarkThemeEnabled);
  }

  toggleTheme(): void {
    this.isDarkThemeEnabled = !this.isDarkThemeEnabled;
    this.themeService.enableDarkTheme(this.isDarkThemeEnabled);
  }
}