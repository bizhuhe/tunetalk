export class UpdateMusicDto {
  reviews: string[];

  constructor(reviews: string[]) {
    this.reviews = reviews;
  }
}
