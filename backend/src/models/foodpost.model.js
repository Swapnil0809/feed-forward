import mongoose, { Schema } from "mongoose";
import { locationSchema } from "./location.model.js";

const foodpostSchema = new Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
    },
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    images: [
      {
        type: String,
      },
    ],
    quantity: {
      type: Number,
    },
    foodType: {
      type: String,
    },
    expiryDate: {
      type: Date,
    },
    pickupDate: {
      type: Date,
    },
    location: locationSchema,
    status: {
      type: String,
      enum: ["available", "claimed", "expired"],
    },
  },
  { timestamps: true }
);

export const FoodPost = mongoose.model("FoodPost", foodpostSchema);
