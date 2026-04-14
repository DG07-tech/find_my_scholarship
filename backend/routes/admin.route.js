import express from "express";
import {
  addAnnouncements,
  addScheme,
  getAllQuestions,
  deleteQuestion,
  answerQuestion,
  getAllStudents,
  verifyStudent,
  deleteStudent,
  getAdminProfile,
  updateAdminSettings,
  updateAdminProfile,
  addOrUpdateSettings,
  getAdminSettings,
  editAnnouncement,
  deleteAnnouncement,
  deleteScheme,
  editScheme,
} from "../controllers/admin.controller.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin profile and settings routes
router.route("/profile").post(getAdminProfile);
router.route("/profile").put(updateAdminProfile);
router.route("/settings").get(getAdminSettings);
router.route("/settings").put(updateAdminSettings);
// router.route("/settings").post(addOrUpdateSettings);

// Existing routes
router.route("/addscheme").post(protect, adminOnly, addScheme);
router.route("/addannouncements").post(protect, adminOnly, addAnnouncements);
router.route("/questions").get(protect, adminOnly, getAllQuestions);
router.route("/students").get(getAllStudents);
router.route("/students/:id/verify").put(protect, adminOnly, verifyStudent);
router.route("/students/:id").delete(protect, adminOnly, deleteStudent);
router
  .route("/questions/:id")
  .put(protect, adminOnly, answerQuestion)
  .delete(protect, adminOnly, deleteQuestion);

// Announcement routes
router.route("/editannouncement/:id").put(protect, adminOnly, editAnnouncement);
router
  .route("/deleteannouncement/:id")
  .delete(protect, adminOnly, deleteAnnouncement);

// Scheme routes
router.route("/editscheme/:id").put(protect, adminOnly, editScheme);
router.delete("/deletescheme/:id", protect, adminOnly, deleteScheme);

export default router;
