import { Router } from "express";
import { addRequest } from "../controllers/request.controller";
import { isRecipient, verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

// secured routes
router.route("/add-request/:postId").post(verifyJWT, isRecipient, addRequest);

export default router;
