// admin/GrowEquipments/adminGrowEquipmentsRoutes.js
const express = require("express");
const multer  = require("multer");
const path    = require("path");
const { v4: uuidv4 } = require("uuid");
const ctrl    = require("./adminGrowEquipmentsController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "../../public/images/GrowEquipments")),
  filename: (req, file, cb) =>
    cb(null, uuidv4() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "cover", maxCount: 1 }
  ]),
  ctrl.createGrowEquipment
);

router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "cover", maxCount: 1 }
  ]),
  ctrl.updateGrowEquipment
);

router.get(   "/",    ctrl.getAllGrowEquipments);
router.get(   "/:id", ctrl.getGrowEquipmentById);
router.delete("/:id", ctrl.deleteGrowEquipment);

module.exports = router;
