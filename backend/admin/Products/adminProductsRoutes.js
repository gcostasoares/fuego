// backend/admin/Products/adminProductsRoutes.js

const express = require("express");
const multer  = require("multer");
const path    = require("path");
const ctr     = require("./adminProductsController");

const router = express.Router();

// Multer saves under public/images/Products
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "../../public/images/Products")),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}_${file.originalname}`)
});
const upload = multer({ storage });

router.get("/",        ctr.getProducts);
router.get("/:id",     ctr.getProductById);
router.post("/",       upload.array("images"), ctr.createProduct);
router.put("/:id",     upload.array("images"), ctr.updateProduct);
router.delete("/:id",  ctr.deleteProduct);

module.exports = router;
