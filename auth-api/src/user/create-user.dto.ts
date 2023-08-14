export class CreateUserDto {
  email: string;
  name: string;
  bio: string;
  createdAt: Date;
  avatar: string; // avatar will be an image, stored as a string in db
  reviews: [];
  replies:[];

  constructor(
    name: string,
    email: string,
    bio: string,
    createdAt: Date,
    avatar: string,
    reviews: [],
    replies:[],
  ) {
    this.name = name;
    this.email = email;
    this.bio = bio;
    this.createdAt = createdAt;
    this.avatar = avatar;
    this.reviews = reviews;
    this.replies = replies;
  }
}