import { body, param, query } from "express-validator";
import { validationErrorHandler } from "../utils/index.js";
import Task from "../models/Task.js";

export const getTaskValidation = [
  query("status")
    .optional()
    .trim()
    .isIn(["PENDING", "IN_PROGRESS", "COMPLETED"])
    .withMessage("Status must be one of: PENDING, IN_PROGRESS, COMPLETED"),
  validationErrorHandler,
];

export const createTaskValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .trim()
    .isLength({ max: 100 })
    .withMessage("Title must be at most 100 characters long"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must be at most 500 characters long"),
  body("dueDate")
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .toDate()
    .withMessage("Due date must be a valid date"),
  validationErrorHandler,
];

export const updateTaskValidation = [
  param("id")
    .notEmpty()
    .withMessage("Task ID is required")
    .isMongoId()
    .withMessage("Invalid Task ID format"),
  body("title")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Title must be at most 100 characters long"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must be at most 500 characters long"),
  body("dueDate")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Due date must be a valid date"),
  body("status")
    .optional()
    .trim()
    .isIn(["PENDING", "IN_PROGRESS", "COMPLETED"])
    .withMessage("Status must be one of: PENDING, IN_PROGRESS, COMPLETED"),
  validationErrorHandler,
];

export const deleteTaskValidation = [
  param("id")
    .notEmpty()
    .withMessage("Task ID is required")
    .isMongoId()
    .withMessage("Invalid Task ID format"),
  validationErrorHandler,
];