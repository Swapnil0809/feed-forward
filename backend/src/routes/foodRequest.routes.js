import { Router } from "express";
import {
  addFoodRequest,
  updateFoodRequest,
  deleteFoodRequest,
  getRecipientFoodRequests,
  getFoodRequests,
  fulfillFoodRequest,
} from "../controllers/foodRequest.controller.js";
import {
  verifyJWT,
  isDonor,
  isRecipient,
} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/add-request")
  .post(upload.none(), verifyJWT, isRecipient, addFoodRequest);

router
  .route("/update-request/:requestId")
  .patch(upload.none(), verifyJWT, isRecipient, updateFoodRequest);

router
  .route("/delete-request/:requestId")
  .delete(verifyJWT, isRecipient, deleteFoodRequest);

router
  .route("/get-recipient-requests")
  .get(verifyJWT, isRecipient, getRecipientFoodRequests);

router.route("/get-requests").get(verifyJWT, isDonor, getFoodRequests);

router
  .route("/fulfill-request/:requestId")
  .patch(verifyJWT, isDonor, fulfillFoodRequest);

export default router;
