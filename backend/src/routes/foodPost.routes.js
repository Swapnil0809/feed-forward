import { Router } from "express";
import {
  addFoodPost,
  updateFoodPost,
  deleteFoodPost,
  getDonorFoodPosts,
  getAvailableFoodPosts,
  addPostRequest,
} from "../controllers/foodPost.controller.js";
import {
  verifyJWT,
  isDonor,
  isRecipient,
} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// secured routes
router
  .route("/add-post")
  .post(upload.array("images"), verifyJWT, isDonor, addFoodPost);

router
  .route("/update-post/:postId")
  .patch(upload.array("images"), verifyJWT, isDonor, updateFoodPost);

router.route("/delete-post/:postId").delete(verifyJWT, isDonor, deleteFoodPost);

router.route("/get-donor-posts").get(verifyJWT, isDonor, getDonorFoodPosts);

router
  .route("/get-available-posts")
  .get(verifyJWT, isRecipient, getAvailableFoodPosts);

router
  .route("/add-request/:postId")
  .post(verifyJWT, isRecipient, addPostRequest);

export default router;
