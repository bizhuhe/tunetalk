export class CreateReplyDto {
  user: string;
  userName: string;
  review: string;
  reply: string;
  createdAt: Date;

  constructor(
    user: string,
    userName: string,
    review: string,
    reply: string,
    createdAt: Date
  ) {
      (this.user = user),
      (this.userName = userName),
      this.review = review,
      (this.reply = reply),
      (this.createdAt = createdAt);
  }
}
