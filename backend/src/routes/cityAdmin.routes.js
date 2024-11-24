import { Router } from "express";
import {
  verifyRecipient,
  getFoodPosts,
  getFoodRequest,
} from "../controllers/cityAdmin.controller.js";
import { verifyJWT, isCityAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// secured routes
router
  .route("/verify-recipient/:username")
  .post(verifyJWT, isCityAdmin, verifyRecipient);

router.route("/get-food-posts").get(verifyJWT, isCityAdmin, getFoodPosts);
router.route("/get-food-requests").get(verifyJWT, isCityAdmin, getFoodRequest);

export default router;
