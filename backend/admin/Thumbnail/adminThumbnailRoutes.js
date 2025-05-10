const express      = require("express");
const multer       = require("multer");
const path         = require("path");
const { v4: uuidv4 } = require("uuid");
const router       = express.Router();
const controllers  = require("./adminThumbnailController");

// configure multer to save uploads under public/images/Thumbnail
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "../../public/images/Thumbnail")),
  filename: (req, file, cb) =>
    cb(null, uuidv4() + path.extname(file.originalname))
});
const upload = multer({ storage });

router
  .get(   "/",           controllers.listThumbnail)
  .get(   "/:id",        controllers.getThumbnail)
  .post(  "/",    upload.single("image"), controllers.createThumbnail)
  .put(   "/:id", upload.single("image"), controllers.updateThumbnail)
  .delete("/:id",        controllers.deleteThumbnail);

module.exports = router;
