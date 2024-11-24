import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "express-async-handler";
import { PostRequest } from "../models/postRequest.model.js";

const addFoodRequest = asyncHandler(async (req, res) => {
  const { title, description, quantity, foodType } = req.body;

  if (
    [title, description, quantity, foodType].some(
      (field) => !field || (typeof field === "string" && field.trim() === "")
    )
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  const postRequest = await PostRequest.create({
    postedBy: req.user._id,
    title,
    description,
    quantity,
    foodType,
    location: req.user.location,
    status: "unfulfilled",
  });

  if (!postRequest) {
    throw new ApiError(500, "Something went wrong while adding request");
  }

  console.log("Food request added successfully");

  return res
    .status(200)
    .json(new ApiResponse(200, postRequest, "Food request added successfully"));
});

const getFoodRequests = asyncHandler(async (req, res) => {
  const foodRequests = await PostRequest.find({
    "location.properties.city": req.user.location.properties.city,
    status: "unfulfilled",
  });

  console.log("Food requests fetched successfully");

  return res
    .status(200)
    .json(
      new ApiResponse(200, foodRequests, "Food requests fetched successfully")
    );
});

export { addFoodRequest, getFoodRequests };
