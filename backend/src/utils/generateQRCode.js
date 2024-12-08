import QRCode from "qrcode";

import asyncHandler from "express-async-handler";
import { ApiError } from "./ApiError";

// Generate a QR code for a specific donation ID
export const generateQRCode = asyncHandler(async (donationId) => {
  const donationUrl = `${process.env.CORS_ORIGIN}/donation-complete/${donationId}`;

  try {
    const qrCodeDataUrl = await QRCode.toDataURL(donationUrl); // Generates a base64 encoded image
    return qrCodeDataUrl;
  } catch (err) {
    throw new ApiError(500, `Error generating QR code: ${err.message}`);
  }
});
