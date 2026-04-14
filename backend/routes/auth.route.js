import express from "express";
import {
  login,
  logout,
  register,
  resetPassword,
  sendMail,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.route("/signup").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/reset-password/").post(sendMail);
router.route("/reset-password/:id/:token").post(resetPassword);

export default router;
