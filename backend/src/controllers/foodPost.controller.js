import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "express-async-handler";
import { sendEmail } from "../utils/mailer.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { FoodPost } from "../models/foodpost.model.js";

const addFoodPost = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    quantity,
    foodType,
    expiryDate,
    pickupDate,
    useUserCoordinates,
    coordinates,
    address,
    state,
    city,
    pincode,
  } = req.body;

  if (
    [title, description, quantity, foodType, expiryDate, pickupDate].some(
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
  console.log(uploadResults);

  // extract cloudinary urls
  const imageUrls = uploadResults.map((result) => result.url);

  let location;

  if (useUserCoordinates) {
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
    foodType,
    expiryDate: new Date(expiryDate),
    pickupDate: new Date(pickupDate),
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

export { addFoodPost };
