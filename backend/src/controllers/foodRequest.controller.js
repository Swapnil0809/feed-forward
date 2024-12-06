import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "express-async-handler";
import { FoodRequest } from "../models/foodRequest.model.js";

const addFoodRequest = asyncHandler(async (req, res) => {
  const { title, description, quantity, quantityUnit, foodType, requiredBy } =
    req.body;

  if (
    [title, description, quantity, quantityUnit, foodType, requiredBy].some(
      (field) => !field || (typeof field === "string" && field.trim() === "")
    )
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  const foodRequest = await FoodRequest.create({
    requestedBy: req.user._id,
    title,
    description,
    quantity,
    quantityUnit,
    foodType,
    requiredBy: new Date(requiredBy),
    location: req.user.location,
    status: "unfulfilled",
  });

  if (!foodRequest) {
    throw new ApiError(500, "Something went wrong while adding request");
  }

  console.log("Food request added successfully");

  return res
    .status(200)
    .json(new ApiResponse(200, foodRequest, "Food request added successfully"));
});

const updateFoodRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { title, description, quantity, quantityUnit, foodType, requiredBy } =
    req.body;

  const foodRequest = await FoodRequest.findById(requestId);

  // check if food request exists
  if (!foodRequest) {
    throw new ApiError(404, "Food request not found");
  }

  // check if user is authorized to update food request
  if (!foodRequest.requestedBy.equals(req.user._id)) {
    throw new ApiError(403, "Unauthorized access to update food request");
  }

  foodRequest.title = title || foodRequest.title;
  foodRequest.description = description || foodRequest.description;
  foodRequest.quantity = quantity || foodRequest.quantity;
  foodRequest.quantityUnit = quantityUnit || foodRequest.quantityUnit;
  foodRequest.foodType = foodType || foodRequest.foodType;
  foodRequest.requiredBy = requiredBy
    ? new Date(requiredBy)
    : foodRequest.requiredBy;

  await foodRequest.save();

  console.log("Food request updated successfully");

  return res
    .status(200)
    .json(
      new ApiResponse(200, foodRequest, "Food request updated successfully")
    );
});

const deleteFoodRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;

  const foodRequest = await FoodRequest.findById(requestId);

  // check if food request exists
  if (!foodRequest) {
    throw new ApiError(404, "Food request not found");
  }

  // check if user is authorized to delete food request
  if (!foodRequest.postedBy.equals(req.user._id)) {
    throw new ApiError(403, "Unauthorized access to update food request");
  }

  // delete food request
  await foodRequest.deleteOne();

  console.log("Food request deleted successfully");

  return res
    .status(200)
    .json(new ApiResponse(200, "Food request deleted successfully"));
});

const getRecipientFoodRequests = asyncHandler(async (req, res) => {
  const foodRequests = await FoodRequest.find({ requestedBy: req.user._id });

  console.log("Food requests fetched successfully");

  return res
    .status(200)
    .json(
      new ApiResponse(200, foodRequests, "Food requests fetched successfully")
    );
});

const getFoodRequests = asyncHandler(async (req, res) => {
  const foodRequests = await FoodRequest.find({
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

export {
  addFoodRequest,
  updateFoodRequest,
  deleteFoodRequest,
  getRecipientFoodRequests,
  getFoodRequests,
};
