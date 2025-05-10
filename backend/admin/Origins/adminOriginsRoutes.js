// backend/admin/Origins/adminOriginsRoutes.js

const express = require("express");
const multer  = require("multer");
const path    = require("path");
const { v4: uuidv4 } = require("uuid");
const ctrl    = require("./adminOriginsController");

const router = express.Router();

// Configure storage for origin images
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "../../public/images/Origin")),
  filename: (req, file, cb) =>
    cb(null, uuidv4() + path.extname(file.originalname))
});

const upload = multer({ storage });

// Routes
router
  // List all origins
  .get("/", ctrl.listOrigins)

  // Get one origin by ID
  .get("/:id", ctrl.getOriginById)

  // Create a new origin (image field must be named "file")
  .post("/", upload.single("file"), ctrl.createOrigin)

  // Update an existing origin (image field must be named "file")
  .put("/:id", upload.single("file"), ctrl.updateOrigin)

  // Delete an origin
  .delete("/:id", ctrl.deleteOrigin);

module.exports = router;
