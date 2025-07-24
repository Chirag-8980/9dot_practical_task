import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async (req, res, next) => {
  const token = req.headers["token"];
  if (!token) {
    return res.status(401).json({
      status: false,
      message: "Unauthorized User",
      logout: true,
    });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized User",
        logout: true,
      });
    }
    const isUser = await User.findById(user.uid).select("-password -__v");
    req.user = isUser;
    next();
  });
};
