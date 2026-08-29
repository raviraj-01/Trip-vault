const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

const handleMongoError = (error, res, fallback) => {
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0];
    const message = field === "username" ? "Username already taken" : "Email already exists";
    return res.status(409).json({ message });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: Object.values(error.errors)
        .map((err) => err.message)
        .join(", "),
    });
  }

  return res.status(500).json({ message: fallback });
};

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, username, email, password } = req.body;

    if (!name?.trim() || !username?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: "Name, username, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username.trim())) {
      return res.status(400).json({
        message: "Username must be 3–30 characters and use only letters, numbers, and underscores",
      });
    }

    try {
      await User.create({ name: name.trim(), username: username.trim(), email, password });
      return res.status(201).json({ message: "User registered" });
    } catch (error) {
      return handleMongoError(error, res, "Server error during registration");
    }
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    const isMatch = user && (await user.comparePassword(password));

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    return res.json({ token });
  })
);

router.get(
  "/me",
  authMiddleware,
  (req, res) =>
    res.json({
      id: req.user._id,
      name: req.user.name,
      username: req.user.username,
      email: req.user.email,
      bio: req.user.bio || "",
    })
);

module.exports = router;
