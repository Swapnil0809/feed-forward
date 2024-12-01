import { Router } from "express";
import { getCityAdmins } from "../controllers/admin.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// secured routes
router.route("/get-city-admins").get(verifyJWT, isAdmin, getCityAdmins);

export default router;
