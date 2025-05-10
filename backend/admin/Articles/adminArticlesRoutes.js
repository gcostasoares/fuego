// backend/admin/Articles/adminArticlesRoutes.js
const express       = require("express");
const multer        = require("multer");
const path          = require("path");
const { v4: uuidv4 } = require("uuid");
const ctrl          = require("./adminArticlesController");

const router = express.Router();

// 1) Single /reorder route (with JSON parser)
router.put(
  "/reorder",
  express.json(),
  ctrl.reorderArticles
);

// 2) Multer storage for article images
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "../../public/images/Articles")),
  filename: (req, file, cb) =>
    cb(null, uuidv4() + path.extname(file.originalname))
});
const upload = multer({ storage });

// 3) Standard CRUD routes
router
  .get("/",             ctrl.listArticles)
  .get("/:id",          ctrl.getArticle)
  .post("/",  upload.single("file"), ctrl.createArticle)
  .put("/:id", upload.single("file"), ctrl.updateArticle)
  .delete("/:id",       ctrl.deleteArticle);

module.exports = router;
