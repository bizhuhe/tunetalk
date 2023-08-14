import { Injectable, Inject, Logger } from "@nestjs/common";
import { Model } from "mongoose";
import { Music } from "./music.interface";
import { CreateMusicDto } from "./create-music.dto";
import { UpdateMusicDto } from "./update-music.dto";
import { Review } from "../review/review.interface";

@Injectable()
export class MusicService {
  private readonly logger = new Logger(MusicService.name);

  constructor(
    @Inject("MUSIC_MODEL")
    private musicModel: Model<Music>,
    @Inject("REVIEW_MODEL")
    private reviewModel: Model<Review>
  ) {}

  async create(createMusicDto: CreateMusicDto): Promise<Music> {
    const { id, musicName, artists, image, popularity, release } = createMusicDto;
  
    try {
      let music = await this.musicModel.findOne({ id });
  
      if (!music) {
        music = new this.musicModel({
          id,
          musicName,
          artists,
          image,
          popularity,
          release,
          reviews: [],
        });
        console.log("this music ", music);
        music = await music.save();
      }

      return music;
    } catch (error) {
      console.log("Error saving music:", error);
      throw new Error("Failed to create music");
    }
  }
  
 // }
 async getMusicReviews(musicId: string): Promise<Review[]> {
  const music = await this.musicModel.findOne({ id: musicId });
  
  if (!music) {
    return []; // Return an empty array when there are no reviews
  }
  const reviewIds = music.reviews.map((id) => id.toString()); // Convert review IDs to strings
  // Retrieve the reviews based on the review IDs
  const reviews = await this.reviewModel.find({ _id: { $in: reviewIds } });
  console.log("the current music ", music);
  console.log("get the review for music ", reviews);
  return reviews;
}


async getMusicById(musicId: String) {
  const music = await this.musicModel.findOne({ id: musicId }).exec();
  return music;
}
async updateMusic(id: string, updateMusicDto: UpdateMusicDto) {
  try {
    const musicToUpdate = await this.musicModel.findOne({ id: id });
    if (!musicToUpdate) {
      throw new Error("You are trying to update a non-existing music");
    }
    musicToUpdate.reviews = updateMusicDto.reviews;
    await musicToUpdate.save();
    console.log("The music ", id, " is updated");
  } catch (error) {
    console.log("Error updating music:", error);
  }
}
  
}
