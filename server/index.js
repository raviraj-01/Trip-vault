require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const tripRoutes = require("./routes/trips");
const userRoutes = require("./routes/users");

const { MONGO_URI, JWT_SECRET, PORT = 5000 } = process.env;

if (!MONGO_URI || !JWT_SECRET) {
  console.error("Missing MONGO_URI or JWT_SECRET in server/.env");
  process.exit(1);
}

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/users", userRoutes);

app.use((_req, res) => res.status(404).json({ message: "Route not found" }));

app.use((err, _req, res, _next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "Image must be 5MB or smaller" });
  }

  if (err.message === "Only image files are allowed") {
    return res.status(400).json({ message: err.message });
  }

  if (
    err.http_code ||
    err.name === "CloudinaryError" ||
    err.message?.toLowerCase().includes("cloudinary")
  ) {
    console.error("Image upload failed:", err.message);
    const response = {
      message: "Image upload failed. Check your Cloudinary credentials and try again.",
    };

    if (process.env.NODE_ENV !== "production") {
      response.details = err.message;
      response.providerStatus = err.http_code;
    }

    return res.status(502).json(response);
  }

  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    server.on("error", (error) => {
      const message =
        error.code === "EADDRINUSE"
          ? `Port ${PORT} is already in use. Stop the other process and restart.`
          : error.message;
      console.error(message);
      process.exit(1);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });
