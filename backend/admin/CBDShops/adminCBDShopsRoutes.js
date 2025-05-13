const express = require("express");
const multer  = require("multer");
const path    = require("path");
const { v4: uuidv4 } = require("uuid");
const ctrl    = require("./adminCBDShopsController");

const router = express.Router();

const storage = multer.diskStorage({
destination: (req, file, cb) =>
cb(null, path.join(\_\_dirname, "../../public/images/CBDShops")),
filename: (req, file, cb) =>
cb(null, uuidv4() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ← Here’s the fix: specify maxCount for each field
router.post(
"/",
upload.fields(\[
{ name: "image", maxCount: 1 },
{ name: "cover", maxCount: 1 }
]),
ctrl.createCBDShop
);

router.put(
"/\:id",
upload.fields(\[
{ name: "image", maxCount: 1 },
{ name: "cover", maxCount: 1 }
]),
ctrl.updateCBDShop
);

router.get(   "/",    ctrl.getAllCBDShops);
router.get(   "/\:id", ctrl.getCBDShopById);
router.delete("/\:id", ctrl.deleteCBDShop);
