import * as mongoose from "mongoose";

export const ReplySchema = new mongoose.Schema({

  user: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  review:{
    type: String,
    required: true,
  },
  reply: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
