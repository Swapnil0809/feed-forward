import asyncHandler from "express-async-handler";

import { CityAdmin, Donor, Recipient } from "../models/user.model.js";
import { FoodPost } from "../models/foodPost.model.js";
import { FoodRequest } from "../models/foodRequest.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendEmail } from "../utils/mailer.js";

const getVerificationList = asyncHandler(async (req, res) => {
  const recipients = await Recipient.find({
    "location.properties.city": req.user.location.properties.city,
    isVerified: false,
  }).select("-password");
  console.log(recipients);
  console.log("Verification list fetched successfully");
  return res
    .status(200)
    .json(
      new ApiResponse(200, recipients, "Verification list fetched successfully")
    );
});

const verifyRecipient = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const recipient = await Recipient.findOne({ _id: id });

  if (!recipient) {
    throw new ApiError(400, "Recipient not found");
  }

  recipient.isVerified = true;
  await recipient.save();

  console.log("Recipient verified successfully");

  const message = `
  <p>
    Your account with the username ${recipient.username} has been verified, now you can use the FeedForward platform and claim donations from users across your city
  </p>
`;

  await sendEmail([recipient.email], "Verification Successfull", message);

  return res
    .status(200)
    .json(new ApiResponse(200, "Recipient verified successfully"));
});

const rejectRecipient = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const recipient = await Recipient.findOne({ _id: id });

  if (!recipient) {
    throw new ApiError(400, "Recipient not found");
  }

  const mail = recipient.email;

  await recipient.deleteOne();

  const message = `
  <p>
  Your account with the username ${recipient.username} has been deleted as your account was rejected by your city admin, please contact the city admin for any queries <br/>
  <b>City Admin</b><br/>
  <b>Email:</b> ${req.user.email}<br/>
  <b>Phone:</b> ${req.user.phoneNo}
  </p>
  `;

  await sendEmail([email], "Verification Rejected", message);

  console.log("Recipient rejected successfully");
});

const getFoodPosts = asyncHandler(async (req, res) => {
  const foodPosts = await FoodPost.find({
    "location.properties.city": req.user.location.properties.city,
    status: "available",
  });

  console.log("Food posts fetched successfully");

  return res
    .status(200)
    .json(new ApiResponse(200, "Food posts fetched successfully", foodPosts));
});

const getFoodRequest = asyncHandler(async (req, res) => {
  const foodRequests = await FoodRequest.find({
    "location.properties.city": req.user.location.properties.city,
    status: "unfulfilled",
  });

  console.log("Food requests fetched successfully");

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Food requests fetched successfully", foodRequests)
    );
});

export {
  getVerificationList,
  verifyRecipient,
  rejectRecipient,
  getFoodPosts,
  getFoodRequest,
};
