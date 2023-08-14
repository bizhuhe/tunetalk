import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';

@NgModule({
  declarations: [NavbarComponent, ThemeSwitcherComponent],
  imports: [CommonModule],
  exports: [NavbarComponent, ThemeSwitcherComponent],
})
export class NavbarModule {}
