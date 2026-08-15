const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const handleMongoError = (error, res, fallback) => {
  if (error.code === 11000) {
    return res.status(409).json({ message: "Email already exists" });
  }

  if (error.name === "ValidationError") {
    const message = Object.values(error.errors)
      .map((err) => err.message)
      .join(", ");
    return res.status(400).json({ message });
  }

  return res.status(500).json({ message: fallback });
};

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    try {
      await User.create({ name: name.trim(), email, password });
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

    return res.json({ token: signToken(user._id) });
  })
);

router.get("/me", authMiddleware, (req, res) =>
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  })
);

module.exports = router;
