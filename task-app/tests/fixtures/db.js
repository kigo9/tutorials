const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "Anna Guscina",
  email: "a.guscinaaa@gmail.com",
  password: "Jigglypoof13",
  tokens: [{ token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET) }],
};
const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "Kirils Golubevs",
  email: "k.golubevs@gmail.com",
  password: "qwerty123",
  tokens: [{ token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET) }],
};
const taskOne = {
  _id: mongoose.Types.ObjectId(),
  description: "Go for smoke",
  completed: false,
  user: userOneId,
};
const taskTwo = {
  _id: mongoose.Types.ObjectId(),
  description: "Buy a laptop",
  completed: true,
  user: userOneId,
};
const taskThree = {
  _id: mongoose.Types.ObjectId(),
  description: "Fuck some bitches",
  completed: true,
  user: userTwoId,
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  userOneId,
  userOne,
  userTwo,
  taskOne,
  setupDatabase,
};
