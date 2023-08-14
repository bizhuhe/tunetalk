export class CreateMusicDto {
  id: string;
  musicName: string;
  artists: string[];
  image: string;
  popularity: number;
  release: Date;
  reviews: string[];

  constructor(
    id: string,
    musicName: string,
    artists: string[],
    image: string,
    popularity: number,
    release: Date,
    reviews: string[],
  ) {
    this.id = id,
    this.musicName = musicName,
    this.artists = artists,
    this.image = image,
    this.popularity = popularity,
    this.release = release,
    this.reviews = reviews
  }
}
