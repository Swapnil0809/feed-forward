import { Router } from "express";
import { addFoodPost } from "../controllers/foodPost.controller.js";
import { verifyJWT, isDonor } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// secured routes
router
  .route("/add-post")
  .post(upload.array("images"), verifyJWT, isDonor, addFoodPost);

export default router;
