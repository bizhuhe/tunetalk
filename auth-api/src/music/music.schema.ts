import * as mongoose from "mongoose";

export const MusicSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  musicName: {
    type: String,
    required: true,
  },
  artists: {
    type: [String],
    required: true,
  },
  image: {
    type: String,
  },
  popularity: {
    type: Number,
  },
  release: {
    type: Date,
  },

  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
});