const express = require("express");
const sharp = require("sharp");
const User = require("../models/user");
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const {
  sendWelcomeEmail,
  sendCancellationEmail,
} = require("../emails/account");
const router = express.Router();

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();

    sendWelcomeEmail(user.email, user.name);

    const token = await user.getAuthToken();

    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findUserByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.getAuthToken();

    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    const tokenToDelete = req.token;

    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== tokenToDelete
    );

    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const avatarBuffer = await sharp(req.file.buffer)
      .png()
      .resize(250, 250)
      .toBuffer();

    req.user.avatar = avatarBuffer;

    await req.user.save();

    res.send();
  },
  (error, _, res) => {
    res.status(400).send({ error: error.message });
  }
);

router.get("/users/me", auth, async (req, res) => {
  await req.user.populate("tasks").execPopulate();
  res.send(req.user);
});

router.get("/users/:id/avatar", async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const hasUpdates = updates.length > 0;
  const allowedUpdates = ["name", "password", "email", "age"];

  const isAllowedToUpdate =
    hasUpdates && updates.every((update) => allowedUpdates.includes(update));

  if (!isAllowedToUpdate) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));

    await req.user.save();

    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();

    sendCancellationEmail(req.user.email, req.user.name);

    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;

  await req.user.save();

  res.send();
});

module.exports = router;
