import { Component } from '@angular/core';
import { JazzService } from './jazz-page.service';

@Component({
  selector: 'app-jazz-page',
  templateUrl: './jazz-page.component.html',
  styleUrls: ['../tunetalk/tunetalk.component.css']
})
export class JazzPageComponent {
  constructor(
    public jazzService: JazzService,

  ) {}

  async ngOnInit() {
    await this.jazzService.getJazzMusic();
  }

}