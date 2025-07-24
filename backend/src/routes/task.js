import express from "express";
import { asyncErrorHandler } from "../utils/index.js";
import userAuthentication from "../middleware/userAuthentication.js";
import { createTaskValidation, deleteTaskValidation, getTaskValidation, updateTaskValidation } from "../validation/taskValidaion.js";
import Task from "../models/Task.js";
const router = express.Router();

router.use(userAuthentication);

// Get Task route
router.get(
  "/",
  getTaskValidation,
  asyncErrorHandler(async (req, res) => {
    const { _id } = req.user;
    const { status, search, page = 1, limit = 10 } = req.query;
    const filter = { userId: _id };

    if (status) filter.status = status;
    if (search) filter.title = { $regex: search, $options: "i" };

    const tasks = await Task.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(filter);

    res.json({
      status: true,
      message: "Tasks fetched successfully",
      data: { total, page: parseInt(page), tasks },
    });
  })
);

// Create Task route
router.post(
  "/",
  createTaskValidation,
  asyncErrorHandler(async (req, res) => {
    const { title, description, dueDate } = req.body;
    const { _id } = req.user;

    const newTask = new Task({
      title,
      description,
      dueDate,
      userId: _id,
    });

    await newTask.save();

    res.status(201).json({
      status: true,
      message: "Task created successfully",
      data: newTask,
    });
  })
);

// Update Task route
router.put(
  "/:id",
  updateTaskValidation,
  asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, dueDate , status } = req.body;
    const { _id } = req.user;

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: _id },
      { title, description, dueDate, status },
      { new: true }
    );

    if (!task) {
      return res.status(400).json({ status: false, message: "Task not found" });
    }

    res.status(200).json({
      status: true,
      message: "Task updated successfully",
      data: task,
    });
  })
);

// Delete Task route
router.delete(
  "/:id",
  deleteTaskValidation,
  asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { _id } = req.user;

    const task = await Task.findOneAndDelete({ _id: id, userId: _id });

    if (!task) {
      return res.status(400).json({ status: false, message: "Task not found" });
    }

    res.status(200).json({
      status: true,
      message: "Task deleted successfully",
    });
  })
);

export default router;
