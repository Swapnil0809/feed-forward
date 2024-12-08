import asyncHandler from "express-async-handler";

import { FoodPost } from "../models/foodPost.model.js";
import { Donor, Recipient } from "../models/user.model.js";
import { Donation } from "../models/donation.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { validateRequiredFields } from "../utils/validateRequiredFields.js";
import { createLocationObject } from "../utils/createLocationObject.js";
import { sendEmail } from "../utils/mailer.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { generateQRCode } from "../utils/generateQRCode.js";

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
    pincode,
  } = req.body;

  validateRequiredFields([
    title,
    description,
    quantity,
    quantityUnit,
    foodType,
    bestBefore,
    useUserLocation,
  ]);

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
  } else {
    // construct location object
    location = createLocationObject({
      userLocation: req.user.location,
      coordinates,
      address,
      state,
      city,
      pincode,
    });
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

  const recipients = await Recipient.find(
    {
      "location.properties.city": foodPost.location.properties.city,
    },
    { _id: 0, role: 0, email: 1 }
  );

  const recipientsEmails = recipients.map((recipient) => recipient.email);

  const message = `
    <p>New Food Post is available on our FeedForward Platform <br/>
    The post details are: <br/>
    <b>Title</b>:${foodPost.title}<br/>
    <b>Description</b>:${foodPost.description}<br/>
    <b>Quantiy</b>:${foodPost.quantity} ${foodPost.quantityUnit}<br/>
    <b>Food Type</b>:${foodPost.foodType}<br/>
    <b>Best Before</b>:${foodPost.bestBefore}<br/>
    </p>
  `;

  await sendEmail(recipientsEmails, "New Food Post Available", message);

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
    location = createLocationObject({
      userLocation: req.user.location,
      coordinates,
      address,
      state,
      city,
      pincode,
    });
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

const requestFood = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const foodPost = await FoodPost.findById(postId);

  // check if food post exists
  if (!foodPost) {
    throw new ApiError(404, "Food post not found");
  }

  const existingDonation = await Donation.findOne({
    donationFrom: "FoodPost",
    referenceId: foodPost._id,
  });

  if (existingDonation) {
    throw new ApiError(400, "Already donated");
  }

  const donation = await Donation.create({
    donationFrom: "FoodPost",
    referenceId: foodPost._id,
    donorId: foodPost.postedBy,
    recipientId: req.user._id,
    status: "in-progress",
  });

  if (!donation) {
    throw new ApiError(500, "Something went wrong while adding donation");
  }

  await foodPost.updateOne({ status: "claimed" });

  console.log(
    "Your request has been approved, now the donation is in progress"
  );

  const donor = await Donor.findById(foodPost.postedBy, {
    _id: 0,
    role: 0,
    email: 1,
  });

  const qrCodeUrl = await generateQRCode(donation._id);

  const donorMessage = `
    <p>your food post has to donated to ${req.user.username} <br/>
    The Recipient details are: <br/>
    <b>Email</b>:${req.user.email}<br/>
    <b>Phone No</b>:${req.user.phoneNo}<br/>
    <b>Organization Name</b>:${req.user.organizationName} ${foodPost.quantityUnit}<br/>
    <b>Organization Type</b>:${req.user.organizationType}<br/><br/>
    Please show the below QR code to recipient while they pickup the food <br/>
    <img src="${qrCodeUrl}" alt="QR Code" />
    </p>
  `;

  await sendEmail([donor.email], "Donation Request", donorMessage);

  const lon = foodPost.location.coordinates[0];
  const lat = foodPost.location.coordinates[1];

  const recipientMessage = `
    <p>Your donation request has been approved <br/>
    The Donor details are: <br/>
    <b>Email</b>:${donor.email}<br/>
    <b>Phone No</b>:${donor.phoneNo}<br/>
    Please collect your food from the below address & scan the QR code to complete the donation <br/>
    <b>Address</b>:${foodPost.location.properties.address}<br/>
    <a href="https://www.google.com/maps?q=${lat},${lon}">click here</a> to navigate closer to the location <br/>
    </p>
  `;

  await sendEmail([req.user.email], "Donation in progress", recipientMessage);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        donation,
        "Your request has been approved, now the donation is in progress"
      )
    );
});

export {
  addFoodPost,
  updateFoodPost,
  deleteFoodPost,
  getDonorFoodPosts,
  getAvailableFoodPosts,
  requestFood,
};
