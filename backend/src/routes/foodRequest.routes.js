import { Router } from "express";
import {
  addFoodRequest,
  getFoodRequests,
} from "../controllers/foodRequest.controller.js";
import {
  verifyJWT,
  isDonor,
  isRecipient,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add-request").post(verifyJWT, isRecipient, addFoodRequest);
router.route("/get-requests").get(verifyJWT, isDonor, getFoodRequests);

export default router;
