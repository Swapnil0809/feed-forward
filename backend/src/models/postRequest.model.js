import mongoose, { Schema } from "mongoose";

const postRequestSchema = new Schema(
  {
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipient",
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodPost",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
    },
  },
  { timestamps: true }
);

export const PostRequest = mongoose.model("Request", postRequestSchema);
