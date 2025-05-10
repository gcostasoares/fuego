// backend/admin/Manufacturers/adminManufacturersRoutes.js

const express = require("express");
const multer  = require("multer");
const path    = require("path");
const { v4: uuidv4 } = require("uuid");
const ctrl    = require("./adminManufacturersController");

const router = express.Router();

// configure multer to store uploaded images under public/images/Manufacturers
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "../../public/images/Manufacturer")),
  filename: (req, file, cb) =>
    cb(null, uuidv4() + path.extname(file.originalname))
});

const upload = multer({ storage });

// CRUD routes for manufacturers
router
  // GET /Manufacturers
  .get("/", ctrl.listManufacturers)

  // GET /Manufacturers/:id
  .get("/:id", ctrl.getManufacturerById)

  // POST /Manufacturers
  // expects multipart/form-data with one file under field name "file"
  .post("/", upload.single("file"), ctrl.createManufacturer)

  // PUT /Manufacturers/:id
  // to update both data and optionally replace the image
  .put("/:id", upload.single("file"), ctrl.updateManufacturer)

  // DELETE /Manufacturers/:id
  .delete("/:id", ctrl.deleteManufacturer);

module.exports = router;
