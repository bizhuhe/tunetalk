import {
  Controller,
  Post,
  Body,
  Logger,
  Get,
  Delete,
  Put,
  Param,
} from "@nestjs/common";
import { ReviewService } from "./review.service";
import { CreateReviewDto } from "./create-review.dto";
import { Review } from "./review.interface";
import { UpdateReviewDto } from "./update-review.dto";
import { MailerService } from "../mailer/mailer.service";
import { reviewProviders } from './review.providers';

@Controller("reviews")
export class ReviewController {
  private readonly logger = new Logger(ReviewController.name);

  constructor(
    private reviewService: ReviewService,
    private mailerService: MailerService
  ) {}

  // create a new review and post it
  @Post()
  async createReview(
    @Body() createReviewDto: CreateReviewDto
  ): Promise<Review | null> {
    try {
      this.logger.log("Received request to create a review");
      const createdReview = await this.reviewService.create(createReviewDto);
      this.logger.log("Review created successfully");
      return createdReview;
    } catch (error) {
      this.logger.error("Error creating review:", error);
      throw new Error("Failed to create review");
    }
  }
  // get all the reviews from the review api
  @Get()
  async getAllReviews(): Promise<Review[]> {
    try {
      this.logger.log("Received request to get all reviews");
      const reviews = await this.reviewService.findAll();
      return reviews;
    } catch (error) {
      this.logger.error("Error retrieving reviews:", error);
      throw new Error("Failed to retrieve reviews");
    }
  }

    // get one review from the review api
    @Get()
    async getOneReview(reviewId): Promise<Review> {
      try {
        this.logger.log("Received request to get a review");
        const review = await this.reviewService.findReviewById(reviewId);
        return review;
      } catch (error) {
        this.logger.error("Error retrieving the review:", error);
        throw new Error("Failed to retrieve review");
      }
    }

  @Get(":id")
  async getReviewById(@Param("id") id: string): Promise<Review | null> {
    try {
      const review = await this.reviewService.findReviewById(id);
      return review;
    } catch (error) {
      throw new Error("Failed to get review by ID");
    }
  }
  @Delete(":id")
  async remove(@Param("id") id: string) {
    this.logger.log("Received request to delete review ", id);
    this.reviewService.deleteReview(id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updateReviewDto: UpdateReviewDto) {
    this.logger.log("Received request to update review ", id);
    this.reviewService.updateReview(id, updateReviewDto);
  }

// add likes to a review
@Put(':id/like')
async likeAReview(@Param('id') id: string, @Body() body: any): Promise<{ message: string, userLiked:boolean }> {
  console.log(body);

  try {
    const userEmail = body.userEmail;
    this.logger.log(`Received request to like review with id ${id} from user with id ${userEmail}`);
    const userLiked = await this.reviewService.likeAReview(id, userEmail);
    return { message: 'Review liked successfully.', userLiked: userLiked };
  } catch (error) {
    this.logger.error("Failed to like the review:", error);
    throw new Error('Failed to like the review.');
  }
}



  @Post("share")
  async shareReview(
    @Body()
    data: {
      createReview: CreateReviewDto;
      data: { recipient: string; subject: string; text: string };
    }
  ) {
    try {
      // const reviewToSend = await this.reviewService.create(data.createReview);
      const reviewToSend = data.createReview;
      const { recipient, subject, text } = data.data;
      // Include the review in the email body
      const emailBody = `
        Review:
        user: ${reviewToSend.user}
        userName: ${reviewToSend.userName}
        song: ${reviewToSend.song}
        songName: ${reviewToSend.songName}
        Comment: ${reviewToSend.comment}
        Rating: ${reviewToSend.rating}
  
        ${text}
      `;

      await this.mailerService.sendEmail(recipient, subject, emailBody);
      return { message: "Email sent successfully" };
    } catch (error) {
      this.logger.error("Failed to share review:", error);
      throw new Error("Failed to share review");
    }
  }
}
