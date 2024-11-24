import mongoose, { mongo, Schema } from "mongoose";
import { locationSchema } from "./location.model";

const foodRequestSchema = new Schema({
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipient",
  },
  title: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  quantity: {
    type: Number,
  },
  foodType: {
    type: String,
    enum: ["veg", "non-veg", "both"],
  },
  location: locationSchema,
  status: {
    type: String,
    enum: ["unfulfilled", "fulfilled"],
  },
});

export const FoodRequest = mongoose.model("FoodRequest", foodRequestSchema);
