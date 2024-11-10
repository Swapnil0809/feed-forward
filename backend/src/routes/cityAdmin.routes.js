import { Router } from "express";
import { verifyRecipient } from "../controllers/cityAdmin.controller.js";
import { verifyJWT, isCityAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// secured routes
router
  .route("/verify-recipient/:username")
  .post(verifyJWT, isCityAdmin, verifyRecipient);

export default router;
