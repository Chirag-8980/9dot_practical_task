import { validationResult } from "express-validator";

export const asyncErrorHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const validationErrorHandler = (req, res, next) => {
  const errorFormatter = ({ msg, path, location }) => {
    return {
      path,
      location,
      message: msg,
    };
  };
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    const error = errors.array()[0];
    return res.status(400).json({ status: false, error });
  }
  next();
};
