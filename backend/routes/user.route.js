import express from "express";
import {
  checkEligibility,
  getProfile,
  sendQuestion,
  getUserQuestions,
  getPublicQuestions,
  deleteQuestion,
} from "../controllers/user.controller.js";
import { protect, userOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/scholarships/check-eligibility")
  .post(protect, userOnly, checkEligibility);

router.route("/profile").post(protect, userOnly, getProfile);

router
  .route("/questions")
  .post(protect, userOnly, sendQuestion)
  .get(protect, userOnly, getUserQuestions);

router.route("/questions/:id").delete(protect, userOnly, deleteQuestion);

router.route("/public-questions").get(getPublicQuestions);

export default router;
