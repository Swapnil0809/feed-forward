import mongoose, { Schema } from "mongoose";
import { locationSchema } from "./location.model.js";

const foodPostSchema = new Schema(
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
    quantityUnit: {
      type: String,
      enum: ["kg", "unit", "litre", "packet", "box", "other"],
      required: true,
    },
    foodType: {
      type: String,
      enum: ["veg", "non-veg"],
    },
    bestBefore: {
      type: Date,
      validate: {
        validator: function (value) {
          return value > Date.now(); // Expiry date must be in the future
        },
        message: "Expiry date must be in the future.",
      },
    },
    location: locationSchema,
    status: {
      type: String,
      enum: ["available", "claimed", "expired", "donated"],
    },
  },
  { timestamps: true }
);

export const FoodPost = mongoose.model("FoodPost", foodPostSchema);
