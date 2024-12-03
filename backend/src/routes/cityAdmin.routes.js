import { Router } from "express";
import {
  getVerificationList,
  verifyRecipient,
  rejectRecipient,
  getFoodPosts,
  getFoodRequest,
} from "../controllers/cityAdmin.controller.js";
import { verifyJWT, isCityAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// secured routes
router
  .route("/get-verification-list")
  .get(verifyJWT, isCityAdmin, getVerificationList);
router
  .route("/verify-recipient/:id")
  .patch(verifyJWT, isCityAdmin, verifyRecipient);
router
  .route("/reject-recipient/:id")
  .delete(verifyJWT, isCityAdmin, rejectRecipient);

router.route("/get-food-posts").get(verifyJWT, isCityAdmin, getFoodPosts);
router.route("/get-food-requests").get(verifyJWT, isCityAdmin, getFoodRequest);

export default router;
