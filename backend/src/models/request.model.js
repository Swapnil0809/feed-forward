import mongoose, { Schema } from "mongoose";

const requestSchema = new Schema(
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

export const Request = mongoose.model("Request", requestSchema);
