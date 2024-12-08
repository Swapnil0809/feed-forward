import asyncHandler from "express-async-handler";
import QRCode from "qrcode";

import { ApiError } from "./ApiError.js";
import { uploadOnCloudinary } from "./cloudinary.js";

// Generate a QR code for a specific donation ID
export const generateQRCode = asyncHandler(async (donationId) => {
  const filePath = `./public/temp/${donationId}`;
  const donationUrl = `${process.env.CORS_ORIGIN}/donation-complete/${donationId}`;
  try {
    const qrCodeDataUrl = await QRCode.toFile(filePath, donationUrl, {
      type: "png",
    }); // Generates a base64 encoded image

    const uploadResponse = await uploadOnCloudinary(filePath, "qr-codes");
    if (uploadResponse && uploadResponse.url) {
      console.log("QR Code uploaded to Cloudinary:", uploadResponse.url);
      return uploadResponse.url; // Return the secure Cloudinary URL
    }
    return qrCodeDataUrl;
  } catch (err) {
    throw new ApiError(500, `Error generating QR code: ${err.message}`);
  }
});
