import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncErrorHandler } from "../utils/index.js";
import {
  loginValidation,
  registrationValidation,
} from "../validation/authValidation.js";
const router = express.Router();

// Login route
router.post(
  "/login",
  loginValidation,
  asyncErrorHandler(async (req, res) => {
    const { password, email } = req.body;
    const isUser = await User.findOne({ email }).select("+password");
    if (isUser) {
      const isPassword = await bcrypt.compare(password, isUser.password);
      if (!isPassword) {
        return res.status(400).json({
          status: false,
          message: "Invalid email or password",
        });
      }
      const token = jwt.sign({ uid: isUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      delete isUser._doc.password;
      res.status(200).json({
        token,
        status: true,
        message: "Login successfull...",
        result: isUser,
      });
    } else {
      res.status(400).json({
        status: false,
        message: "Invalid email or password",
      });
    }
  })
);

// Registration route
router.post(
  "/registration",
  registrationValidation,
  asyncErrorHandler(async (req, res) => {
    const { password, email, name } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const UserData = await User.create({
      name,
      email,
      password: hashPassword,
    });
    const token = jwt.sign({ uid: UserData._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(201).json({
      token,
      status: true,
      message: "Registration successfull...",
      result: UserData,
    });
  })
);

export default router;
