import asyncHandler from "express-async-handler";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendEmail } from "../utils/mailer.js";
import { Donation } from "../models/donation.model.js";
import { FoodPost } from "../models/foodPost.model.js";
import { FoodRequest } from "../models/foodRequest.model.js";

const updateDonationStatus = asyncHandler(async (req, res) => {
  const { donationId } = req.params;

  const donation = await Donation.findById(donationId);

  // check if donation exists
  if (!donation) {
    throw new ApiError(404, "Donation not found");
  }

  if (donation.status === "completed") {
    throw new ApiError(400, "Donation already completed");
  }

  await donation.updateOne({ status: "completed" });

  if (donation.donationFrom === "FoodRequest") {
    const foodRequest = await FoodRequest.findByIdAndUpdate(
      donation.referenceId,
      { status: "fulfilled" }
    );
  } else {
    const foodPost = await FoodPost.findByIdAndUpdate(donation.referenceId, {
      status: "donated",
    });
  }

  console.log("Donation status updated successfully");

  return res
    .status(200)
    .json(
      new ApiResponse(200, donation, "Donation status updated successfully")
    );
});

export { updateDonationStatus };
