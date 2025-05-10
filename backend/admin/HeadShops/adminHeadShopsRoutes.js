const express = require("express");
const multer  = require("multer");
const path    = require("path");
const { v4: uuidv4 } = require("uuid");
const ctrl    = require("./adminHeadShopsController");

const router = express.Router();

// files go to backend/public/images/HeadShops
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "../../public/images/HeadShops")),
  filename: (req, file, cb) =>
    cb(null, uuidv4() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.get(    "/",        ctrl.getAllHeadShops);
router.get(    "/:id",     ctrl.getHeadShopById);
router.post(   "/", upload.fields([
                  { name: "image" },
                  { name: "cover" }
                ]),           ctrl.createHeadShop);
router.put(    "/:id", upload.fields([
                  { name: "image" },
                  { name: "cover" }
                ]),           ctrl.updateHeadShop);
router.delete( "/:id",     ctrl.deleteHeadShop);

module.exports = router;
