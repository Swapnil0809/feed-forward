import { Router } from "express";
import {
  getCityAdmins,
  removeCityAdmin,
} from "../controllers/admin.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// secured routes
router.route("/get-city-admins").get(verifyJWT, isAdmin, getCityAdmins);
router
  .route("/remove-city-admin/:id")
  .delete(verifyJWT, isAdmin, removeCityAdmin);

export default router;
