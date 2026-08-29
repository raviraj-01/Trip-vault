const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    destination: {
      type: String,
      required: [true, "Destination is required"],
      trim: true,
    },
    startDate: { type: Date },
    endDate: { type: Date },
    description: { type: String, trim: true },
    rating: { type: Number, min: 1, max: 5 },
    coverImage: { type: String, default: "" },
    photos: { type: [String], default: [] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);
