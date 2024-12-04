import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "express-async-handler";
import { sendEmail } from "../utils/mailer.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { FoodPost } from "../models/foodPost.model.js";

const addFoodPost = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    quantity,
    quantityUnit,
    foodType,
    bestBefore,
    useUserLocation,
    coordinates,
    address,
    state,
    city,
    pincode,
  } = req.body;

  if (
    [title, description, quantity, quantityUnit, foodType, bestBefore].some(
      (field) => !field || (typeof field === "string" && field.trim() === "")
    )
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  // upload images to cloudinary
  const uploadPromises = req.files?.map((file) =>
    uploadOnCloudinary(file.path)
  );

  // wait for all uploads to complete
  const uploadResults = await Promise.all(uploadPromises);

  // extract cloudinary urls
  const imageUrls = uploadResults.map((result) => result.url);

  let location;
  if (useUserLocation === "true") {
    location = req.user.location;
    console.log("user location", req.user.location);
    console.log("copied location", location);
  } else {
    // convert coordinates into number
    const [lon, lat] = coordinates.split(",").map(Number);

    // construct location object
    location = {
      type: "Point",
      coordinates: [lon, lat],
      properties: {
        address,
        state,
        city,
        pincode,
      },
    };
  }

  const foodPost = await FoodPost.create({
    postedBy: req.user._id,
    title,
    description,
    images: imageUrls,
    quantity,
    quantityUnit,
    foodType,
    bestBefore: new Date(bestBefore),
    location,
    status: "available",
  });

  if (!foodPost) {
    throw new ApiError(500, "Something went wrong while adding food post");
  }

  console.log("Food post added successfully");

  return res
    .status(200)
    .json(new ApiResponse(200, foodPost, "Food post added successfully"));
});

const updateFoodPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const {
    title,
    description,
    quantity,
    quantityUnit,
    foodType,
    bestBefore,
    useUserLocation,
    coordinates,
    address,
    state,
    city,
    pincode,
  } = req.body;

  const foodPost = await FoodPost.findById(postId);

  // check if food post exists
  if (!foodPost) {
    throw new ApiError(404, "Food post not found");
  }

  // check if user is authorized to delete food post
  if (!foodPost.postedBy.equals(req.user._id)) {
    throw new ApiError(403, "Unauthorized access to delete food post");
  }

  // handle image update
  if (req.files?.length > 0) {
    // delete existing images from Cloudinary
    const deletePromises = foodPost.images.map((imageUrl) =>
      deleteFromCloudinary(imageUrl)
    );
    const deleteResults = await Promise.all(deletePromises);

    // upload new images to Cloudinary
    const uploadPromises = req.files.map((file) =>
      uploadOnCloudinary(file.path)
    );
    const uploadResults = await Promise.all(uploadPromises);

    const imageUrls = uploadResults.map((result) => result.url);

    foodPost.images = imageUrls;
  }

  // handle location update
  let location;
  if (useUserLocation === "true") {
    location = req.user.location;
  } else {
    const [lon, lat] = coordinates?.split(",").map(Number);
    console.log([lon, lat] || foodPost.location.coordinates);
    console.log(address || foodPost.location.properties.address);
    location = {
      type: "Point",
      coordinates: [lon, lat] || foodPost.location.coordinates,
      properties: {
        address: address || foodPost.location.properties.address,
        state: state || foodPost.location.properties.state,
        city: city || foodPost.location.properties.city,
        pincode: pincode || foodPost.location.properties.pincode,
      },
    };
  }

  // update the food post fields
  foodPost.title = title || foodPost.title;
  foodPost.description = description || foodPost.description;
  foodPost.quantity = quantity || foodPost.quantity;
  foodPost.quantityUnit = quantityUnit || foodPost.quantityUnit;
  foodPost.foodType = foodType || foodPost.foodType;
  foodPost.bestBefore = bestBefore ? new Date(bestBefore) : foodPost.bestBefore;
  foodPost.location = location;

  // save the updated food post
  await foodPost.save();

  console.log("Food post updated successfully");

  return res
    .status(200)
    .json(new ApiResponse(200, foodPost, "Food post updated successfully"));
});

const deleteFoodPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const foodPost = await FoodPost.findById(postId);

  // check if food post exists
  if (!foodPost) {
    throw new ApiError(404, "Food post not found");
  }

  // check if user is authorized to delete food post
  if (!foodPost.postedBy.equals(req.user._id)) {
    throw new ApiError(403, "Unauthorized access to delete food post");
  }

  // delete existing images from Cloudinary
  for (const imageUrl of foodPost.images) {
    await deleteFromCloudinary(imageUrl);
  }

  // delete food post
  await foodPost.deleteOne();

  console.log("Food post deleted successfully");

  return res
    .status(200)
    .json(new ApiResponse(200, "Food post deleted successfully"));
});

const getDonorFoodPosts = asyncHandler(async (req, res) => {
  const foodPosts = await FoodPost.find({ postedBy: req.user._id });

  console.log("Food posts fetched successfully");

  return res
    .status(200)
    .json(new ApiResponse(200, foodPosts, "Food posts fetched successfully"));
});

const updateExpiredFoodPosts = asyncHandler(async (city) => {
  const currentDate = new Date();

  // query to update expired food posts
  const result = await FoodPost.updateMany(
    {
      "location.properties.city": city,
      expiryDate: { $lte: currentDate },
      status: { $ne: "expired" }, // Only update non-expired posts
    },
    { $set: { status: "expired" } }
  );

  console.log(
    `${result.modifiedCount} food posts in city '${city}' were marked as expired.`
  );
});

const getAvailableFoodPosts = asyncHandler(async (req, res) => {
  // update expired food posts
  await updateExpiredFoodPosts(req.user.location.properties.city);

  const foodPosts = await FoodPost.find({
    "location.properties.city": req.user.location.properties.city,
    status: "available",
  });

  console.log("Available food posts fetched successfully");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        foodPosts,
        "Available food posts fetched successfully"
      )
    );
});

export {
  addFoodPost,
  updateFoodPost,
  deleteFoodPost,
  getDonorFoodPosts,
  getAvailableFoodPosts,
};
