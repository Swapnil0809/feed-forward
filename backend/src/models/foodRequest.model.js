import mongoose, { Schema } from "mongoose";
import { locationSchema } from "./location.model.js";

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
  quantityUnit: {
    type: String,
    enum: ["kg", "units", "litre", "packet", "box", "other"],
    required: true,
  },
  foodType: {
    type: String,
    enum: ["veg", "non-veg", "both"],
  },
  requiredBy: {
    type: Date,
    validate: {
      validator: function (value) {
        return value >= Date.now();
      },
      message: "The requiredBy date must not be in the past.",
    },
  },
  location: locationSchema,
  status: {
    type: String,
    enum: ["unfulfilled", "in-progress", "fulfilled"],
  },
});

export const FoodRequest = mongoose.model("FoodRequest", foodRequestSchema);
