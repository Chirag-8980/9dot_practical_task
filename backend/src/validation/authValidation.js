import { body } from "express-validator";
import { validationErrorHandler } from "../utils/index.js";
import User from "../models/User.js";

export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("password").trim().notEmpty().withMessage("Password is required"),
  validationErrorHandler,
];

export const registrationValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long")
    .isAlpha()
    .withMessage("Name must contain only alphabetical characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .custom(async (value) => {
      const isUser = await User.findOne({ email: value });
      if (isUser) {
        throw new Error("User with this email already exists");
      }
      return true;
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password is too weak"),
  validationErrorHandler,
];
