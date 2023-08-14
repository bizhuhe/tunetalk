export class UpdateUserDto {
  bio: string;
  avatar: string; // avatar will be an image, stored as a string in db

  constructor(
    bio: string,
    avatar: string
  ) {
    this.bio = bio;
    this.avatar = avatar;
  }
}
