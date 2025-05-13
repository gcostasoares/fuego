const express = require("express");
const multer  = require("multer");
const path    = require("path");
const { v4: uuidv4 } = require("uuid");
const ctrl    = require("./adminHeadShopsController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "../../public/images/HeadShops")),
  filename: (req, file, cb) =>
    cb(null, uuidv4() + path.extname(file.originalname))
});
const upload = multer({ storage });

// create
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "cover", maxCount: 1 }
  ]),
  ctrl.createHeadShop
);

// update
router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "cover", maxCount: 1 }
  ]),
  ctrl.updateHeadShop
);

// read list & single
router.get(   "/",    ctrl.getAllHeadShops);
router.get(   "/:id", ctrl.getHeadShopById);

// delete
router.delete("/:id", ctrl.deleteHeadShop);

module.exports = router;
