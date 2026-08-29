const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const requiredCloudinaryVars = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  upload_prefix: process.env.CLOUDINARY_UPLOAD_PREFIX,
});

const ensureCloudinaryConfig = (_req, res, next) => {
  const missing = requiredCloudinaryVars.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    return res.status(500).json({
      message: `Image uploads are not configured. Missing: ${missing.join(", ")}`,
    });
  }

  next();
};

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "tripvault",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
  },
});

const upload = multer({
  storage: cloudinaryStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

upload.ensureCloudinaryConfig = ensureCloudinaryConfig;

module.exports = upload;
