import express from "express";
import { getSchemes } from "../controllers/scheme.controller.js";
import { addScheme } from "../controllers/admin.controller.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/all").get(getSchemes);
router.route("/add").post(protect, adminOnly, addScheme);

export default router;
