import { Component } from '@angular/core';
import { RockService } from './rock-page.service';

@Component({
  selector: 'app-rock-page',
  templateUrl: './rock-page.component.html',
  styleUrls: ['../tunetalk/tunetalk.component.css']
})
export class RockPageComponent {
  constructor(
    public rockService: RockService,

  ) {}

  async ngOnInit() {
    await this.rockService.getRockMusic();
  }
}
