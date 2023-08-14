import { Injectable, Inject, Logger, Post, Body } from "@nestjs/common";
import { Model } from "mongoose";
import { Reply } from "./reply.interface";
import { CreateReplyDto } from "./create-reply.dto";
import { Review } from "src/review/review.interface";
import { User } from "src/user/user.interface";
@Injectable()
export class ReplyService {
  private readonly logger = new Logger(ReplyService.name);

  constructor(
    @Inject("REPLY_MODEL")
    private replyModel: Model<Reply>,
    @Inject("REVIEW_MODEL")
    private reviewModel: Model<Review>,
    @Inject("USER_MODEL")
    private userModel: Model<User>
  ) {}

  async create(createReplyDto: CreateReplyDto): Promise<Reply | null> {
    const { user, userName, review, reply, createdAt } = createReplyDto;

    try {
      const savedReply = await this.replyModel.create({
        user,
        userName,
        review,
        reply,
        createdAt,
      });
      const currentUser = await this.userModel.findOneAndUpdate(
        { email: user },
        { $push: { replies: savedReply._id } }
      );
      const currentReview = await this.reviewModel.findByIdAndUpdate(
        { _id: review },
        { $push: { replies: savedReply._id } }
      );
      return savedReply;
    } catch (error) {
      this.logger.error("Error saving review:", error);
      throw new Error("Failed to create reply");
    }
  }

  // find all replies
  async findAll(): Promise<Reply[]> {
    return this.replyModel.find().exec();
  }
  // find all replies for a review
  async findAllByReviewId(reviewId: string): Promise<Reply[]> {
    const review = await this.reviewModel.findById(reviewId).populate('replies').exec();
    const replyIds = review.replies.map((id) => id); // Convert reply IDs to strings
    // Retrieve the replies based on the reply IDs
    const replies = await this.replyModel.find({ _id: { $in: replyIds } });
    return replies;
}

}
