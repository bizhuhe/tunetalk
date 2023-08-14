import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-carousel",
  templateUrl: "./carousel.component.html",
  styleUrls: ["./carousel.component.css"],
})
export class CarouselComponent {
  constructor(private router: Router) {}

  openRockPage() {
    this.router.navigate(["/rock"]);
  }
  openJazzPage() {
    this.router.navigate(["/jazz"]);
  }

  openRapPage() {
    this.router.navigate(["/rap"]);
  }
}
