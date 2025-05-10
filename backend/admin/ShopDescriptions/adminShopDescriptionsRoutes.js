// admin/ShopDescriptions/routes.js
const express = require("express");
const multer  = require("multer");
const path    = require("path");
const { v4: uuidv4 } = require("uuid");
const ctrl    = require("./adminShopDescriptionsController");

const router = express.Router();

// === 1) Globally parse JSON for any non-multipart calls ===
router.use((req, res, next) => {
  const ct = (req.headers["content-type"] || "").toLowerCase();
  // if it's not multipart, parse JSON
  if (!ct.startsWith("multipart/")) {
    express.json()(req, res, next);
  } else {
    next();
  }
});

// Directory for storing images
const IMG_DIR = path.join(__dirname, "../../public/images/ShopDescriptions");

// Multer storage config
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, IMG_DIR),
  filename:    (_req, file, cb) => cb(null, uuidv4() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Routes
router
  .get(   "/",        ctrl.listDescriptions)                          // List all
  .get(   "/:id",     ctrl.getDescription)                           // Get one
  .post(  "/",        upload.single("image"), ctrl.createDescription) // Create

  // Bulk reorder: content-type must be application/json
  .put(   "/order",   ctrl.orderDescriptions)                        // Bulk reorder

  // Update (may be multipart or JSON with {sort})
  .put(   "/:id",
           // if multipart ⇒ handle file upload; else JSON already parsed
           (req, res, next) => {
             const ct = (req.headers["content-type"] || "").toLowerCase();
             if (ct.startsWith("multipart/")) {
               return upload.single("image")(req, res, next);
             }
             next();
           },
           ctrl.updateDescription
  )

  .delete("/:id",     ctrl.deleteDescription);                       // Delete

module.exports = router;
