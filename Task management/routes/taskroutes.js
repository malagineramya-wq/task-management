const express = require("express");

const Task = require("../models/Task");
const auth = require("../middleware/auth");

const router = express.Router();

/*
GET ALL TASKS
*/
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/*
CREATE TASK
*/
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, status } =
      req.body;

    const task = new Task({
      title,
      description,
      status,
      user: req.user.id,
    });

    await task.save();

    req.app
      .get("io")
      .emit("taskUpdated");

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/*
UPDATE TASK
*/
router.put("/:id", auth, async (req, res) => {
  try {
    const updatedTask =
      await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    req.app
      .get("io")
      .emit("taskUpdated");

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/*
DELETE TASK
*/
router.delete("/:id", auth, async (req, res) => {
  try {
    await Task.findByIdAndDelete(
      req.params.id
    );

    req.app
      .get("io")
      .emit("taskUpdated");

    res.json({
      message: "Task Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;