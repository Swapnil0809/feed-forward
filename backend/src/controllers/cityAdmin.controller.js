import { User } from "../models/user.model.js";
import { CityAdmin, Donor, Recipient } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "express-async-handler";
import { sendEmail } from "../utils/mailer.js";

const verifyRecipient = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const recipient = await Recipient.findOne({ username });

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

export { verifyRecipient };
