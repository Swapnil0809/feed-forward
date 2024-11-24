import mongoose, { Schema } from "mongoose";

const donationSchema = new Schema(
  {
    foodPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodPost",
    },
    foodRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodRequest",
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
      enum: ["in-progress", "delivered"],
    },
  },
  { timestamps: true }
);

export const Donation = mongoose.model("Donation", donationSchema);
