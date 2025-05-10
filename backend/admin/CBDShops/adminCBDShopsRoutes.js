const express = require("express");
const multer  = require("multer");
const path    = require("path");
const { v4: uuidv4 } = require("uuid");
const ctrl    = require("./adminCBDShopsController");

const router = express.Router();

// Multer setup: files go to backend/public/images/CBDShops
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "../../public/images/CBDShops")),
  filename: (req, file, cb) =>
    cb(null, uuidv4() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get(    "/",        ctrl.getAllCBDShops);
router.get(    "/:id",     ctrl.getCBDShopById);
router.post(   "/", upload.fields([
                  { name: "image" },
                  { name: "cover" }
                ]),           ctrl.createCBDShop);
router.put(    "/:id", upload.fields([
                  { name: "image" },
                  { name: "cover" }
                ]),           ctrl.updateCBDShop);
router.delete( "/:id",     ctrl.deleteCBDShop);

module.exports = router;
