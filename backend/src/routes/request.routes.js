import { Router } from "express";
import { addPostRequest } from "../controllers/postRequest.controller.js";
import { isRecipient, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// secured routes
router
  .route("/add-request/:postId")
  .post(verifyJWT, isRecipient, addPostRequest);

export default router;
