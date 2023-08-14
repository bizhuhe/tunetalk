import { Injectable, Inject } from "@nestjs/common";
import { Review } from "./review.interface";
import { Model } from "mongoose";
import { CreateReviewDto } from "./create-review.dto";
import { Music } from "../music/music.interface";
import { User } from "../user/user.interface";
import { UpdateReviewDto } from "./update-review.dto";
import { MusicService } from "../music/music.service";
import { CreateMusicDto } from "../music/create-music.dto";
import mongoose from "mongoose";

@Injectable()
export class ReviewService {
  private readonly reviews: Review[] = [];

  constructor(
    @Inject("REVIEW_MODEL")
    private reviewModel: Model<Review>,
    @Inject("MUSIC_MODEL")
    private musicModel: Model<Music>,
    @Inject("USER_MODEL")
    private userModel: Model<User>,
    private musicService: MusicService
  ) {}
  async create(createReviewDto: CreateReviewDto): Promise<Review | null> {
    const {
      user,
      userName,
      song,
      songName,
      image,
      rating,
      comment,
      createdAt,
    } = createReviewDto;
  console.log("this is the review", createReviewDto);
    try {
      const savedReview = await this.reviewModel.create({
        user,
        userName,
        song,
        songName,
        image,
        rating,
        comment,
        createdAt,
      });

      let music = await this.musicModel.findOne({ id: song });
      console.log("the review ", savedReview);
      if (music) {
        await this.musicModel.findOneAndUpdate(
          { id: song },
          { $push: { reviews: savedReview._id } }
        );
      }

      const currentUser = await this.userModel.findOneAndUpdate(
        { email: user },
        { $push: { reviews: savedReview._id } }
      );

      return savedReview;
    } catch (error) {
      console.log("Error saving review:", error);
      throw new Error("Failed to create review");
    }
  }

  // delete a review
  async deleteReview(id: string) {
    try {
      console.log("###from review service, delete review ", id);
      let reviewToDelete = null;

      // reviewToDelete = await this.reviewModel.findOne({_id: id});
      reviewToDelete = await this.reviewModel.findOne({
        _id: new mongoose.Types.ObjectId(id),
      });

      if (!reviewToDelete) {
        throw new Error("You're trying to delete a non-exisiting review");
      }

      console.log(`Song ID: ${reviewToDelete.song}`);
      console.log(`User ID: ${reviewToDelete.user}`);

      await this.reviewModel.deleteOne({ _id: id });
      // await this.reviewModel.deleteOne({ id: id });

      await this.musicModel.updateOne(
        { id: reviewToDelete.song },
        { $pull: { reviews: new mongoose.Types.ObjectId(id) } }
      );

      // remove review from user
      await this.userModel.updateOne(
        { email: reviewToDelete.user },
        { $pull: { reviews: new mongoose.Types.ObjectId(id) } }
      );

      console.log("the review ", id, " is deleted");
    } catch (error) {
      console.log("Error deleting review:", error);
      throw new Error("Failed to delete review");
    }
  }

  
 // update a review and other relational data
  async updateReview(id: String, updateReviewDto: UpdateReviewDto) {
    console.log("Updating review: ", id);
    try {
      const reviewToUpdate = await this.reviewModel.findById(id);
      if (!reviewToUpdate) {
        throw new Error("You are trying to update a non-existing review");
      }
      // update the review in the review model
      await this.reviewModel.updateOne({ _id: id }, updateReviewDto);
      if (reviewToUpdate.song) {
        // update the review in the music model
        await this.musicModel.updateOne(
          { id: reviewToUpdate.song },
          { $push: { reviews: reviewToUpdate.id } }
        );
        // update the review in the user model
        await this.userModel.updateOne(
          { email: reviewToUpdate.user },
          { $push: { reviews: reviewToUpdate.id } }
        );
      } else {
        console.log("reviewToUpdate.song is undefined");
      }
      console.log("The review ", id, " is updated");
    } catch (error) {
      console.log("Error updating review:", error);
    }
  }
 
  
  async findReviewById(id: string): Promise<Review | null> {
    try {
      const review = await this.reviewModel.findById(id).exec();
      return review;
    } catch (error) {
      throw new Error("Failed to find review by ID");
    }
  }
  async likeAReview(id: string, userId: string):Promise<boolean> {
    try {
      let userLiked = false;
      let review;
      review = await this.reviewModel.findById(id).exec();
      if (!review.likedByUsers) {
        review.likedByUsers = [];
      }
   
      if (review.likedByUsers.includes(userId)) {
        // dislike the review
        review.likes -= 1;
        review.likedByUsers = review.likedByUsers.filter(user => user !== userId);
      } else {
        review.likes += 1;
        review.likedByUsers.push(userId);
        userLiked = true;
      }
      console.log(review.likedByUsers);
      await review.save(); // Save the updated review
      return userLiked;
    } catch (error) {
      console.error('Error in likeAReview:', error);
      throw new Error("Failed to like review");
    }
  }
  
  
  // get all the reviews
  async findAll(): Promise<Review[]> {
    try {
      const reviews = await this.reviewModel.find().exec();
      if (!reviews) {
        console.log("currently no review has been created");
      }
      // Transform the reviews by adding the 'id' property
      const transformedReviews = reviews.map((review) => ({
        ...review.toObject(),
        id: review._id.toString(),
      }));

      return transformedReviews;
    } catch (error) {
      throw new Error("Failed to retrieve reviews");
    }
  }

// get a review
async findOne(reviewId): Promise <Review> {
  try {
    const review = await this.reviewModel.findOne(reviewId).exec();
    if (!review) {
      console.log("currently no review has been created");
    }
    // Transform the reviews by adding the 'id' property

    return review;
  } catch (error) {
    throw new Error("Failed to retrieve reviews");
  }
}
}