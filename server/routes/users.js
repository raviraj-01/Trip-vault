const express = require("express");
const User = require("../models/User");
const Trip = require("../models/Trip");
const authMiddleware = require("../middleware/authMiddleware");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

const USERNAME_PATTERN = /^[a-z0-9_]{3,30}$/;

router.put(
  "/profile",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { bio, username } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    if (username !== undefined) {
      const nextUsername = String(username).toLowerCase().trim();

      if (!USERNAME_PATTERN.test(nextUsername)) {
        return res.status(400).json({
          message: "Username must be 3–30 characters and use only letters, numbers, and underscores",
        });
      }

      if (nextUsername !== user.username) {
        const taken = await User.findOne({ username: nextUsername, _id: { $ne: user._id } });
        if (taken) {
          return res.status(409).json({ message: "Username already taken" });
        }
        user.username = nextUsername;
      }
    }

    if (bio !== undefined) {
      user.bio = String(bio).trim();
    }

    try {
      await user.save();
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ message: "Username already taken" });
      }
      throw error;
    }

    return res.json({
      id: user._id,
      name: user.name,
      username: user.username,
      bio: user.bio || "",
    });
  })
);

router.get(
  "/:username/profile",
  asyncHandler(async (req, res) => {
    const username = req.params.username?.toLowerCase().trim();
    const user = await User.findOne({ username }).select("name username bio");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const trips = await Trip.find({ user: user._id })
      .select("title destination startDate endDate rating coverImage")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      name: user.name,
      username: user.username,
      bio: user.bio || "",
      trips: trips.map(({ title, destination, startDate, endDate, rating, coverImage }) => ({
        title,
        destination,
        startDate,
        endDate,
        rating,
        coverImage: coverImage || "",
      })),
    });
  })
);

module.exports = router;
