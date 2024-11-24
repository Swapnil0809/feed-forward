import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "express-async-handler";
import { FoodPost } from "../models/foodPost.model.js";
import { PostRequest } from "../models/postRequest.model.js";

const addPostRequest = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const foodPost = await FoodPost.findById(postId);

  // check if food post exists
  if (!foodPost) {
    throw new ApiError(404, "Food post not found");
  }

  const request = await PostRequest.create({
    requestedBy: req.user._id,
    postId: foodPost._id,
    status: "pending",
  });

  if (!request) {
    throw new ApiError(500, "Something went wrong while adding request");
  }

  console.log("Post request added successfully");

  return res
    .status(200)
    .json(new ApiResponse(200, request, "Post request added successfully"));
});

export { addPostRequest };
