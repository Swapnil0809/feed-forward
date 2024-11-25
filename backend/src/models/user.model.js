import mongoose, { Schema } from "mongoose";
import { locationSchema } from "./location.model.js";

// base user schema
const userSchema = new Schema(
  {
    avatar: {
      type: String, // cloudinary url
    },
    username: {
      type: String,
      unique: true,
      required: [true, "Username is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    phoneNo: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    location: locationSchema,
  },
  { discriminatorKey: "role", timestamps: true }
);

userSchema.index({ location: "2dsphere" });
export const User = mongoose.model("User", userSchema);

const donorSchema = new Schema({
  donorType: {
    type: String,
    enum: ["individual", "restaurant"],
  },
});

export const Donor = User.discriminator("Donor", donorSchema);

const recipientSchema = new Schema({
  organizationType: {
    type: String,
    enum: ["charity", "shelter", "community group", "NGO"],
    required: [true, "Organization type is required"],
  },
  registerationNo: {
    type: String,
    unique: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

export const Recipient = User.discriminator("Recipient", recipientSchema);

const cityAdminSchema = new Schema({});

export const CityAdmin = User.discriminator("CityAdmin", cityAdminSchema);

const adminSchema = new Schema({});

export const Admin = User.discriminator("Admin", adminSchema);
