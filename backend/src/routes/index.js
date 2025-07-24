import express from "express";
import authRoutes from "./auth.js";
import taskRoutes from "./task.js";
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/task", taskRoutes);

export default router;
