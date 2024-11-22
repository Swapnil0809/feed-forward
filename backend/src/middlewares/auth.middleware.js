import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(400, "Unauthorized access");
    }
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findById(decodedToken.id).select("-password");
    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message);
  }
});

export const isDonor = asyncHandler(async (req, _, next) => {
  if (req.user?.role !== "Donor") {
    throw new ApiError(401, "Unauthorized access to donor");
  }
  next();
});

export const isRecipient = asyncHandler(async (req, _, next) => {
  if (req.user?.role !== "Recipient") {
    throw new ApiError(401, "Unauthorized access to recipient");
  }
  next();
});

export const isCityAdmin = asyncHandler(async (req, _, next) => {
  if (req.user?.role !== "CityAdmin") {
    throw new ApiError(401, "Unauthorized access to city admin");
  }
  next();
});

export const isAdmin = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(400, "Unauthorized access to admin");
    }
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    if (decodedToken.role !== "admin") {
      throw new ApiError(401, "Invalid access token");
    }
    next();
  } catch (error) {
    throw new ApiError(401, error?.message);
  }
});
