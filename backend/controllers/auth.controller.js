import { User } from "../models/user.model.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { notifyNewUser } from "./admin.controller.js";

export const register = async (req, res) => {
  try {
    const { email, password, username, role } = req.body;

    if (!email || !password || !username || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User Already Exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await User.create({
      email,
      password: hashedPassword,
      username,
      role,
    });

    await notifyNewUser(createdUser);

    return res.status(201).json({
      success: true,
      message: "Account Created Successfully. Please login",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Error creating account",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const user = await User.findOne({
      $or: [{ email }, { username: email }],
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password or email.",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password or email.",
      });
    }

    generateToken(
      res,
      user,
      `Welcome ${user.role === "admin" ? "Admin" : "User"}!`
    );
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Failed to login.",
    });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: false,
      sameSite: "lax",
    });
    res.clearCookie("role", {
      httpOnly: false,
      sameSite: "lax",
    });

    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error during logout" });
  }
};

export const sendMail = async (req, res) => {
  const { email } = req.body;

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.send({ Status: "User does not exist" });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return res.status(500).send({
        success: false,
        message: "Email settings are not configured on the server",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password Link",
      text: `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, function (error) {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .send({ success: false, message: "Failed to send email" });
      }

      return res.send({
        success: true,
        message: "Reset link sent successfully",
      });
    });
  });
};

export const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  jwt.verify(token, process.env.SECRET_KEY, (err) => {
    if (err) {
      return res.json({ Status: "Error with token" });
    }

    bcrypt
      .hash(password, 10)
      .then((hash) => {
        User.findByIdAndUpdate({ _id: id }, { password: hash })
          .then(() => res.send({ status: "success" }))
          .catch((updateError) => res.send({ status: updateError }));
      })
      .catch((hashError) => res.send({ status: hashError }));
  });
};
