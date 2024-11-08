import { Router } from "express";
import {
  donorSignUp,
  recipientSignUp,
  userLogin,
  userLogout,
  createCityAdmin,
} from "../controllers/user.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/donor-signup").post(donorSignUp);
router.route("/recipient-signup").post(recipientSignUp);
router.route("/login").post(userLogin);

// secured routes
router.route("/logout").post(verifyJWT, userLogout);
router.route("/create-city-admin").post(isAdmin, createCityAdmin);

export default router;
