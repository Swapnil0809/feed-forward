import asyncHandler from "express-async-handler";

import { FoodRequest } from "../models/foodRequest.model.js";
import { Donor, Recipient } from "../models/user.model.js";
import { Donation } from "../models/donation.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateQRCode } from "../utils/generateQRCode.js";
import { sendEmail } from "../utils/mailer.js";

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

  const donors = await Donor.find(
    {
      "location.properties.city": foodRequest.location.properties.city,
    },
    { _id: 0, role: 0, email: 1 }
  );

  const donorsEmails = donors.map((donor) => donor.email);

  const message = `
    <p>${req.user.username} are requesting for food!<br/>
    The request details are: <br/>
    <b>Title</b>:${foodRequest.title}<br/>
    <b>Description</b>:${foodRequest.description}<br/>
    <b>Quantiy</b>:${foodRequest.quantity} ${foodRequest.quantityUnit}<br/>
    <b>Food Type</b>:${foodRequest.foodType}<br/>
    <b>Required By</b>:${foodRequest.requiredBy}<br/>
    </p>
  `;

  await sendEmail(donorsEmails, "New Food Post Available", message);

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
  if (!foodRequest.requestedBy.equals(req.user._id)) {
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

const fulfillFoodRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;

  const foodRequest = await FoodRequest.findById(requestId);

  // check if food request exists
  if (!foodRequest) {
    throw new ApiError(404, "Food request not found");
  }

  // check if request is already fulfilled
  if (foodRequest.status === "fulfilled") {
    throw new ApiError(400, "Request already fulfilled");
  }

  // check if donation is added already
  const existingDonation = await Donation.findOne({
    donationFrom: "FoodRequest",
    referenceId: foodRequest._id,
  });

  if (existingDonation) {
    throw new ApiError(400, "Already donated");
  }

  const donation = await Donation.create({
    donationFrom: "FoodRequest",
    referenceId: foodRequest._id,
    donorId: req.user._id,
    recipientId: foodRequest.requestedBy,
    status: "in-progress",
  });

  if (!donation) {
    throw new ApiError(500, "Something went wrong while adding donation");
  }

  await foodRequest.updateOne({ status: "in-progress" });

  console.log("Your donation is now in progress");

  const qrCodeUrl = await generateQRCode(donation._id);

  const recipient = await Recipient.findById(foodRequest.requestedBy, {
    _id: 0,
    role: 0,
    username: 1,
    email: 1,
    phoneNo: 1,
  });

  const donorMessage = `
    <p>your wish to fulfill ${recipient.username}'s food request has been approved <br/>
    The Recipient details are: <br/>
    <b>Email</b>:${recipient.email}<br/>
    <b>Phone No</b>:${recipient.phoneNo}<br/>
    <b>Organization Type</b>:${recipient.organizationType}<br/><br/>
    Please show the below QR code to recipient while they pickup the food <br/>
    <img src="${qrCodeUrl}" alt="QR Code" />
    </p>
  `;

  await sendEmail([req.user.email], "Donation Request", donorMessage);

  const lon = req.user.location.coordinates[0];
  const lat = req.user.location.coordinates[1];

  const recipientMessage = `
    <p>A donor wishes to fulfill your food request <br/>
    The Donor details are: <br/>
    <b>Email</b>:${req.user.email}<br/>
    <b>Phone No</b>:${req.user.phoneNo}<br/>
    Please collect your food from the below address & scan the QR code to complete the donation <br/>
    <b>Address</b>:${req.user.location.properties.address}<br/>
    <a href="https://www.google.com/maps?q=${lat},${lon}">click here</a> to navigate closer to the location <br/>
    </p>
  `;

  await sendEmail([recipient.email], "Donation in progress", recipientMessage);

  return res
    .status(200)
    .json(new ApiResponse(200, donation, "Your donation is now in progress"));
});

export {
  addFoodRequest,
  updateFoodRequest,
  deleteFoodRequest,
  getRecipientFoodRequests,
  getFoodRequests,
  fulfillFoodRequest,
};
