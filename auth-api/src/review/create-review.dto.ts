export class CreateReviewDto {
  user: string;
  userName: string;
  song: string;
  songName: string;
  image: string;
  rating: number;
  comment: string;
  likes: number;
  likedByUsers:[]
  replies: [];

  createdAt: Date;


  constructor(
    user: string,
    userName: string,
    song: string,
    songName: string,
    image: string,
    rating: number,
    comment: string,
    likes: number,
    likedByUsers:[],
    replies: [],
  
    createdAt: Date
  ) {
    this.user = user,
    this.userName = userName,
    this.song = song,
    this.songName = songName,
    this.image = image,
    this.rating = rating,
    this.comment = comment,
    this.likes = likes,
    this.replies = replies,
    this.likedByUsers = likedByUsers,
    this.createdAt = createdAt;
  }
}