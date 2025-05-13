const express = require("express");
const multer  = require("multer");
const path    = require("path");
const { v4: uuidv4 } = require("uuid");
const ctrl    = require("./adminCBDShopsController");

const router = express.Router();

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "../../public/images/CBDShops")),
  filename: (req, file, cb) =>
    cb(null, uuidv4() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Create
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "cover", maxCount: 1 }
  ]),
  ctrl.createCBDShop
);

// Update
router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "cover", maxCount: 1 }
  ]),
  ctrl.updateCBDShop
);

// Read list & single
router.get("/",    ctrl.getAllCBDShops);
router.get("/:id", ctrl.getCBDShopById);

// Delete
router.delete("/:id", ctrl.deleteCBDShop);

module.exports = router;
