import { Router } from "express";
import { updateDonationStatus } from "../controllers/donation.controller.js";
import {
  verifyJWT,
  isDonor,
  isRecipient,
} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// secured routes
router
  .route("/update-status/:donationId")
  .patch(upload.none(), verifyJWT, isRecipient, updateDonationStatus);

export default router;
