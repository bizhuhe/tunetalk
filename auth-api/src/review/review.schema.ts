import * as mongoose from "mongoose";
export const ReviewSchema = new mongoose.Schema({

  user: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  song: {
    type: String,
    required: true,
  },
  songName: {
    type: String,
    retquired: true,
  },
  image: {
    type: String,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  likedByUsers: {
    type: [String],
    default: [],
  },
  replies: { 
    type: Array 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
