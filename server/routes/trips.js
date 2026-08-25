const express = require("express");
const mongoose = require("mongoose");
const Trip = require("../models/Trip");
const authMiddleware = require("../middleware/authMiddleware");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

router.use(authMiddleware);

const parseTripFields = ({ title, destination, startDate, endDate, description, rating }) => {
  if (!title?.trim() || !destination?.trim()) {
    return { error: "Title and destination are required" };
  }

  let parsedRating;
  if (rating !== "" && rating != null) {
    parsedRating = Number(rating);
    if (Number.isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return { error: "Rating must be a number between 1 and 5" };
    }
  }

  return {
    title: title.trim(),
    destination: destination.trim(),
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    description: description?.trim() || undefined,
    rating: parsedRating,
  };
};

const loadOwnedTrip = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Trip not found" });
  }

  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  if (trip.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized to access this trip" });
  }

  req.trip = trip;
  next();
});

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const fields = parseTripFields(req.body);
    if (fields.error) return res.status(400).json({ message: fields.error });

    const trip = await Trip.create({ ...fields, user: req.user._id });
    return res.status(201).json(trip);
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const trips = await Trip.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json(trips);
  })
);

router.get("/:id", loadOwnedTrip, (req, res) => res.json(req.trip));

router.put(
  "/:id",
  loadOwnedTrip,
  asyncHandler(async (req, res) => {
    const fields = parseTripFields(req.body);
    if (fields.error) return res.status(400).json({ message: fields.error });

    Object.assign(req.trip, fields);
    await req.trip.save();
    return res.json(req.trip);
  })
);

router.delete("/:id", loadOwnedTrip, asyncHandler(async (req, res) => {
  await req.trip.deleteOne();
  return res.status(204).send();
}));

module.exports = router;
