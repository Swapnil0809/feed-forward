import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "express-async-handler";
import { FoodPost } from "../models/foodpost.model.js";
import { Request } from "../models/request.model.js";

const addRequest = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const foodPost = await FoodPost.findById(postId);

  // check if food post exists
  if (!foodPost) {
    throw new ApiError(404, "Food post not found");
  }

  const request = await Request.create({
    requestedBy: req.user._id,
    postId: foodPost._id,
    status: "pending",
  });

  if (!request) {
    throw new ApiError(500, "Something went wrong while adding request");
  }

  console.log("Request added successfully");

  return res
    .status(200)
    .json(new ApiResponse(200, request, "Request added successfully"));
});

export { addRequest };
