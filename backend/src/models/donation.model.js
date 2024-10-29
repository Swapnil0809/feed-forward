import mongoose, { Schema } from "mongoose";

const donationSchema = new Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodPost",
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipient",
    },
    status: {
      type: String,
      enum: ["awating", "delivered"],
    },
    feedback: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Donation = mongoose.model("Donation", donationSchema);
