import { Router } from "express";
import {
  donorSignUp,
  recipientSignUp,
  userLogin,
  userLogin,
  userLogout,
} from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.route("/donor-signUp").post(donorSignUp);
router.route("/recipient-signUp").post(recipientSignUp);
router.route("/login").post(userLogin);

// secured routes
router.route("/logout").post(verifyJWT, userLogout);

export default router;
