const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Task = require("../models/task");

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    user: req.user._id,
  });

  try {
    await task.save();

    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET /tasks?completed=true
// GET /tasks?limit=2&skio=2
// GET /tasks?sortBy=createdAt:asc
router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const [sortBy, sorting] = req.query.sortBy.split(":");

    sort[sortBy] = sorting === "asc" ? 1 : -1;
  }

  try {
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();

    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, user: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const hasUpdates = updates.length > 0;
  const allowedUpdates = Object.keys(Task.schema.obj);
  const isAllowedToUpdate =
    hasUpdates && updates.every((update) => allowedUpdates.includes(update));

  if (!isAllowedToUpdate) {
    return res.status(400).send("Invalid updates!");
  }

  try {
    const task = await Task.findOne({ _id, user: req.user._id });

    if (!task) {
      return res.send(404).send();
    }

    updates.forEach((update) => (task[update] = req.body[update]));

    await task.save();

    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const deletedTask = await Task.findOneAndDelete({
      _id,
      user: req.user._id,
    });

    if (!deletedTask) {
      return res.status(404).send();
    }

    res.send(deletedTask);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
